import { Explorer } from "../../core/loops/Explorer.js";
import { Token } from "../../core/objects/Token.js";
import { Storage } from "../../core/storage/Storage.js";
import { Exception } from "../../core/tools/Exception.js";
import { PATH } from "../../core/tools/Location.js";
import { Containers } from "../grouping/Containers.js";
import { Lexer } from "../lexing/Lexer.js";

/**
 * Parcours le tableau de jetons pour importer et exporter des parties de code
 */

    export class Imports extends Explorer{

        constructor(tokenList){
            super(tokenList)
        }

        main(token){

            // Si le jeton ne correspond pas à une règle d'import ou d'export on passe au jeton suivant
            if((token.type !== 'rule'
            || (token.value !== 'import' && token.value !== 'export'))
            && token.type !== 'reference') return;

            // On créer le jeton correspondant à la déclaration
            // On déclare this.declaration pour récupérer le jeton en dehors de la fonction main
            let declaration = this.declaration = new Token(this.uuid).set({
                type: token.value,
                identifier: token.identifier
            })

            declaration.trace.bounds(token.trace)

            // Si le jeton est une règle d'import
            if(token.type === 'rule'
            && token.value === 'import'
            && Storage.behavior !== 'cli'){

                let tokenName = this.after()

                // Si les jetons suivants ne sont pas ceux attendus on renvoie une erreur
                if(tokenName.type !== 'word'
                && (tokenName.type !== 'operator'
                || tokenName.identifier !== 'multiply')) new Exception(declaration, 'NO_NAME')

                if(this.after(2).identifier !== 'keyword'
                || this.after(2).value !== 'from') new Exception(declaration, 'NO_KEYWORD')

                if(this.after(3).type !== 'string') new Exception(declaration, 'EMPTY')

                // On met a jour la trace de pile de la déclaration
                declaration.trace.endBy(this.after(2).trace)
                declaration.value = tokenName.value
                
                // On demande la variable de stockage ou on la créer si elle n'existe pas
                let storage = Storage.import[this.uuid] ||= {}
                
                // On obtient le chemin relatif à la racine
                let path = PATH.location(this.uuid, this.after(3).value.trim())

                // On importe le fichier et ses dépendances internes
                this.import(path)

                /**
                 * Vérification
                 */
                
                    // Si on importe tous les exports du fichier alors on rentre l'ensemble des nom dans l'import
                    if(tokenName.value === "*"){
                        for(let name in Storage.export[path]){
                            storage[name] = path
                        }
                    }
                    
                    // Si on importe qu'un element et que l'export n'existe pas dans le fichier on retourne une erreur
                    else if(!Storage.export[path][tokenName.value]) new Exception(declaration, 'NO_IMPORT')

                    // Sinon on ajoute juste le nom à la liste des imports
                    else storage[tokenName.value] = path


                //
                
                // On supprime les jetons pour les remplacer par la déclaration
                this.output.splice(this.i, 4, declaration)

            }

            // Sinon si le jeton est une règle d'export
            else if(token.type === 'rule'
            && token.value === 'export'){

                // Si les jetons suivants ne sont pas ceux attendus on renvoie une erreur
                if(this.after().type !== 'word') new Exception(declaration, 'NO_NAME')
                if(!this.after(2)) new Exception(declaration, 'EMPTY')

                // On met a jour la trace de pile de la déclaration
                declaration.trace.endBy(this.after(2).trace)

                // On demande la variable de stockage ou on la créer si elle n'existe pas
                let storage = Storage.export[Storage.path[this.uuid]] ||= {}

                // On affecte la valeur au stockage
                // On utilise next pour respecter l'usage de la propriété deep
                // Si le deuxième argument est une référence alors on l'évalue avant qu'elle soit passé comme export
                let evl = this.after(2).type === 'reference'
                storage[this.after().value] = this.next(2, evl) || new Exception(token, 'EMPTY')

                // On supprime les jetons pour les remplacer par la déclaration
                this.output.splice(this.i-2, 3, declaration)
                this.i -= 2

            }

            // Sinon si le jeton est une référence
            else if(token.type === 'reference'){

                let name = token.value
                let path = Storage.path[this.uuid]
                let reference;

                // Si un import distant porte le nom de la référence
                if(Storage.import[this.uuid]
                && Storage.import[this.uuid][name]) {

                    // On récupère le chemin associé
                    path = Storage.import[this.uuid][name]

                }
                // Si un import local porte le nom de la référence
                else if(Storage.export[path]
                && Storage.export[path][name]) {

                    // On ne fait rien la bonne valeur de path est déjà affectée par défaut
                }

                // Si aucun import ne porte le nom de la référence pour cet uuid alors on retourne une erreur
                else {
                    new Exception(token, 'NO_IMPORT')
                }

                // On récupère la référence
                reference = Storage.export[path][name]

                // On récupère le jeton associé et on le clone pour empecher le passage par référence
                let result = reference.deepClone()

                this.output.splice(this.i, 1, result)

            }

        }

        import(path){

            // On vérifie que ce chemin n'existe pas déjà dans les exports sinon on retourne directement le chemin
            if(Storage.export[path]) return;

            // On ajoute le chemin aux imports, si aucune règle @export n'est présente dans le fichier il restera vide
            // De cette manière on empêche les boucles infinies dans les imports
            Storage.export[path] = {}

            // Sinon on demande le fichier de manière synchrone
            let xhr = new XMLHttpRequest()
            xhr.open('GET', path, false)
            xhr.send()

            if(xhr.status != 200){

                // Si la ressource n'est pas trouvée on renvoie une erreur
                new Exception(this.declaration, 'NO_FILE')

            }else{

                let code = xhr.responseText
                
                // On traite le fichier pour en extraire les exports et demander les imports
                // On ajoute la variable path dans lexer pour générer un nouvel uuid accroché à l'url relative à la racine
                new Imports(
                new Containers(
                new Lexer(
                    code, path
                ).run().output
                ).run().output
                ).run().output

            }

        }

    }

//