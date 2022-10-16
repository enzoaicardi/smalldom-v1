import { Explorer } from "../../core/loops/Explorer.js";
import { Token } from "../../core/objects/Token.js";
import { Exception } from "../../core/tools/Exception.js";

/**
 * Parcours le tableau de jetons et regroupe les déclarations conditionnelles
 */

    export class Statements extends Explorer{

        constructor(tokenList){
            super(tokenList)
        }

        main(token){

            // Si le jeton ne correspond pas à une déclaration conditionnelle on passe au jeton suivant
            if(token.type !== 'rule'
            || (token.value !== 'if'
            && token.value !== 'elseif'
            && token.value !== 'else')) return;
            
            /**
             * Vérification de l'enchainement des déclarations conditionnelles
             * elseif et else doivent tout deux êtres précédés d'un if ou elseif
             */

                if(token.value !== 'if'
                && (this.before().type !== 'statement'
                || (this.before().identifier !== 'if'
                && this.before().identifier !== 'elseif'))) new Exception(token, 'NO_STATEMENT')

            //

            // On créer la déclaration conditionnelle
            let statement = new Token(this.uuid).set({
                type: 'statement',
                identifier: token.value,
                deep: true
            })

            // On récupère l'index courant
            let pos = this.i

            // Si la déclaration conditionnelle n'a pas de condition propre
            if(statement.identifier === 'else'){

                let declaration = this.next() || new Exception(token, 'NO_DECLARATION')
                statement.childs.push(declaration)

            }

            // Si la déclaration conditionnelle à une condition propre
            else{

                let condition = this.next() || new Exception(token, 'NO_CONDITION')
                statement.childs.push(condition)

                let declaration = this.next() || new Exception(token, 'NO_DECLARATION')
                statement.childs.push(declaration)

            }
            
            // On met a jour la trace de pile
            statement.childsTrace()

            // On calcule l'index de différence
            let difference = this.i-pos

            // On ajoute la déclaration confitionnelle au tableau
            this.output.splice(pos, difference+1, statement)
            this.i = pos

        }
    }

//    