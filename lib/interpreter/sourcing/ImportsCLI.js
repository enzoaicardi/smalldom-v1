import { Token } from '../../core/objects/Token.js';
import { Storage } from '../../core/storage/Storage.js';
import { Exception } from '../../core/tools/Exception.js';
import { PATH } from '../../core/tools/Location.js';
import { sdom } from '../../sdom.js';
import { Imports } from './Imports.js';

/**
 * Gere les imports depuis le CLI car celui-ci ne gère pas XMLHttpRequest
 * Il est donc necessaire de passer par des promesses ou le système de fichier
 * via node. Dans les deux cas cela necessite l'utilisation d'une fonction dédié
 * qui ne prend pas en charge la profondeur des noeuds, les imports doivent donc
 * être déclarés à la base du fichier (ce qui n'est pas le cas des exports)
 */

export class ImportsCLI{

    constructor(tokenList, resolve){
        this.i = -1
        this.list = tokenList
        this.uuid = this.list.uuid

        this.http;
        this.fs;

        // Resolve contient la fonction passée dans sdom.js afin de résoudre la promesse
        // principale, qui permettra de résoudre la seconde prommesse de sdom.js pour le CLI
        // ce qui imprimera le code final en HTML ou XML
        this.resolve = resolve
    }

    // Cette run est différentes des autres, elle est sur mesure car ImportsCLI n'a pas de déclaration extends
    run(){

        // On importe le module node HTTP et FileSystem
        import('fs').then((fs)=>{

            this.fs = fs

            import('http').then((http)=>{

                this.http = http

                // Lance le premier appel de la fonction next
                this.next()

            })

        })
    }

    next(){

        let i = this.i++

        // Si on arrive au dernier jeton on resout la promesse passée dans sdom.js pour le CLI
        if(i >= this.list.length-1) {

            this.resolve(this.list)
            return;

        }

        let token = this.list[this.i]

        if(token.type === 'rule'
        && token.value === 'import'){

            // On créer la déclaration
            let declaration = this.declaration = new Token(this.uuid).set({
                type: token.value,
                identifier: token.identifier
            })

            declaration.trace.bounds(token.trace)
            
            // On effectue la requete
            let tokenName = this.after()

            // Si les jetons suivants ne sont pas ceux attendus on renvoie une erreur
            if(tokenName.type !== 'word'
            && (tokenName.type !== 'operator'
            || tokenName.identifier !== 'multiply')) new Exception(declaration, 'NO_NAME')

            // On met a jour le nom de la déclaration
            declaration.value = tokenName.value

            if(this.after(2).identifier !== 'keyword'
            || this.after(2).value !== 'from') new Exception(declaration, 'NO_KEYWORD')

            if(this.after(3).type !== 'string') new Exception(declaration, 'EMPTY')

            // On demande la variable de stockage ou on la créer si elle n'existe pas
            let storage = Storage.import[this.uuid] ||= {}
            
            // On obtient le chemin relatif à la racine
            let path = PATH.location(this.uuid, this.after(3).value.trim())
            let sourceCode;

            if(Storage.export[path]) {
                this.next()
                return;
            }else{
                Storage.export[path] = {}
            }

            // Si on a besoin d'https
            if(PATH.isHTTP(path)){

                let data = ''

                this.http.get(path, (res)=>{

                    // Un morceau de réponse est reçu
                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    // La réponse complète à été reçue. On affiche le résultat.
                    res.on('end', () => {

                        sdom.lexingCLI(data, path).then((res)=>{

                            new Imports(res).run().output
                            importRepo()
                            this.next()
        
                        })
                        
                    });


                }).on("error", () => {
                    new Exception(declaration, 'NO_FILE');
                });


            }

            // Si le fichier est dans le système
            else{

                try{
                    sourceCode = this.fs.readFileSync(
                        path,
                        'utf8'
                    );
                }catch{
                    new Exception(declaration, 'NO_FILE')
                }

                sdom.lexingCLI(sourceCode, path).then((res)=>{

                    new Imports(res).run().output
                    importRepo()
                    this.next()

                })

            }

            // On ajoute l'import au répertoire
            const importRepo = () => {
            
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

                // On supprime la déclaration pour éviter son évaluation par new Imports()
                this.list.splice(this.i, 4)
                this.i--;

            }

        }else{
            
            // On passe directement au suivant sans promesse
            this.next()
        }

    }

    after(n){
        return this.list[this.i+(n || 1)] || false
    }

}