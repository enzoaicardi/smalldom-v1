import { Explorer } from "../../../core/loops/Explorer.js"
import { Token } from "../../../core/objects/Token.js";
import { Exception } from "../../../core/tools/Exception.js";

/**
 * Parcours le tableau de jetons et créer les associations via un opérateur défini
 */

    export class Super extends Explorer{

        constructor(tokenList){
            super(tokenList)
        }

        condition(token){
            return true
        }

        main(token){

            // Si le jeton ne correspond pas à une association (voir this.condition) on passe au jeton suivant
            if(!this.condition(token)) return;
            
            // Si le jeton n'a pas de jeton adjacent on retourne une exception
            if(!this.after() || !this.before()) new Exception(token, 'NO_BOUNDS')
            
            let pos = this.i

            // On créer le jeton parent
            let association = new Token(this.uuid).set({
                type: 'association',
                name: token.type,
                identifier: token.identifier,
                deep: true
            })

            // On ajoute les jetons adjacents comme enfants du jeton parent
            association.childs.push(this.before(), this.after())
            association.childsTrace()

            this.output.splice(pos-1, 3, association)

            this.i = pos-1

        }

    }

//