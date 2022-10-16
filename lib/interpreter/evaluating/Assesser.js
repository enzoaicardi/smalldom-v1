import { Explorer } from "../../core/loops/Explorer.js";
import { Token } from "../../core/objects/Token.js";
import { Storage } from "../../core/storage/Storage.js";
import { Exception } from "../../core/tools/Exception.js";

/**
 * Parcours le tableau de jeton et évalue toutes les expressions
 */

    export class Assesser extends Explorer{

        constructor(tokenList){
            super(tokenList)
        }

        /**
         * Fonction main
         */

            main(token){

                // Si le jeton est un conteneur de groupement
                if(token.type === 'container'
                && token.identifier === 'eval'){

                    this.evaluation(token)
                }

                // Si le jeton correspond à l'association de valeurs
                else if(token.type === 'association'){
                    
                    // L'assignation permet d'ajouter une variable
                    this.assignation(token)
                    this.operation(token)
                    this.comparison(token)

                }

                // Si le jeton correspond à déclaration de variable
                else if(token.type === 'variable'
                && token.identifier === 'declaration'){

                    // On récupère la valeur de la variable
                    let result = Storage.variable[token.value]

                    // Si la variable n'est pas trouvée on renvoie une erreur
                    if(!result) new Exception(token, 'NOT_FOUND')

                    // On ajoute une copie de la variable dans le tableau
                    this.output.splice(this.i, 1, result.deepClone())
                }


            }

        /**
         * Methodes
         */

            evaluation(token){

                let result;

                // Si l'expression comporte un ou plusieurs enfants
                if(token.childs.length){

                    // On renvoie uniquement le premier enfant
                    result = token.childs[0]

                    // Si l'expression a plusieurs enfants, c'est une mauvaise pratique, on renvoie un avertissement
                    if(token.childs.length > 1) new Exception(token, 'BAD_RESULT')

                }

                // Si l'expression n'a aucun enfant
                else{

                    result = new Token(this.uuid).set({
                        type: 'boolean',
                        value: false
                    })

                }

                // On extrait le premier enfant, il correspondra au résultat de l'expression
                this.output.splice(this.i, 1, result)

            }

            assignation(token){

                // Si le jeton ne correspond pas à l'assignation de valeurs alors on passe à la méthode suivante
                if(token.name !== 'assignment') return;

                let first = token.childs[0]
                let second = token.childs[1]

                // Si le premier enfant est une assignation de variable
                if(first.type === 'variable'
                && first.identifier === 'assignment'){

                    // On met a jour la valeur de la variable
                    Storage.variable[first.value] = second
                    this.output.splice(this.i, 1)
                    this.i--

                }

                // Sinon on ne fait rien, cela permettra de s'en servir plus tard dans les attributs

            }

            operation(token){

                // ...
                if(token.name !== 'operator') return;

                let first = token.childs[0]
                let second = token.childs[1]

                // Si le second argument n'est pas un nombre, dans tous les autre cas qu'une addition on renvoie une erreur
                if(token.identifier !== 'add' && second.type !== 'number') new Exception(token, 'NaN')

                // Si les deux arguments sont des nombres alors on renvoie le résultat
                if(second.type === 'number'
                && first.type === 'number'){

                    let a = first.value
                    let b = second.value
                    let result;

                    // On calcule le résultat de l'opération
                    if(token.identifier === 'add') result = a + b
                    else if(token.identifier === 'substract') result = a - b
                    else if(token.identifier === 'multiply') result = a * b
                    else if(token.identifier === 'divide') result = a / b
                    else if(token.identifier === 'modulo') result = a % b

                    // On met a jour la valeur
                    first.value = result
                    this.output.splice(this.i, 1, first)

                }

                // Si seul le second argument est un nombre dans le cas d'une multiplication
                else if(second.type === 'number'
                && token.identifier === 'multiply'){

                    first.count = first.count * second.value
                    this.output.splice(this.i, 1, first)

                }

                // Si un ou les deux arguments ne sont pas des nombres dans le cas d'une addition
                else if(token.identifier === 'add'){

                    // Si on additionne deux conteneurs
                    if(first.type === 'container'
                    && second.type === 'container') {

                        // On ajoute les enfants du premier conteneur au second
                        first.childs.push(...second.childs)
                    }

                    // Si on additionne deux valeurs concatenables
                    else if(this.canConcat(first.type)
                    && this.canConcat(second.type)) {

                        first.value = first.value + second.value
                    }

                    else new Exception(token, 'BAD_VALUE')

                    // On met a jour le tableau
                    this.output.splice(this.i, 1, first)

                }

            }

            comparison(token){

                // ...
                if(token.name !== 'comparator') return;

                let first = token.childs[0]
                let second = token.childs[1]

                let bool = new Token(this.uuid).set({
                    type: 'boolean',
                    value: false
                })

                let a = first.value
                let b = second.value
                let result;

                // Si les jetons sont des conteneurs on compare leur nombre d'enfants
                if(first.type === 'container') a = first.childs.length
                if(second.type === 'container') b = second.childs.length

                // Si les types sont comparables
                if((first.type === 'container' || this.canConcat(first.type))
                && (second.type === 'container' || this.canConcat(second.type))) {

                    // Les comparateurs d'égalité fonctionnement avec tous les types
                    if(token.identifier === 'equality') result = a === b
                    else if(token.identifier === 'difference') result = a !== b

                    // Les comparateurs inférieurs et supérieurs ne fonctionnent qu'avec les nombres
                    // On vérifie le type de a et b et pas de first et second car on pourrait avoir "container"
                    else if(typeof a !== 'number' || typeof b !== 'number') new Exception(token, 'BAD_VALUE')

                    else if(token.identifier === 'superior') result = a > b
                    else if(token.identifier === 'inferior') result = a < b

                }

                // Si les types ne sont pas comparables on retourne une erreur
                else new Exception(token, 'BAD_VALUE')

                // On remplace la comparaison par son résultat
                bool.value = result
                this.output.splice(this.i, 1, bool)

            }

        //

        canConcat(type){
            return type === 'number' || type === 'word' || type === 'string'
        }

    }

//