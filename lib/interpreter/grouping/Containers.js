import { Explorer } from "../../core/loops/Explorer.js";
import { Token } from "../../core/objects/Token.js";

/**
 * Parcours le tableau de jetons et créer les conteneurs
 */

    export class Containers extends Explorer{

        constructor(tokenList){
            super(tokenList)
        }

        main(token){

            // Si le jeton ne correspond pas a un conteneur ouvrant on passe au jeton suivant
            if(token.type !== 'delimiter'
            || token.status !== 'open') return;

            // Sinon
            // On récupère la position du curseur
            let pos = this.i++

            // On créer le conteneur
            let container = new Token(this.uuid).set({
                type: 'container',
                identifier: token.identifier,
                deep: true
            })

            // On ajoute les enfants au conteneur
            this.while((t) => {
                return this.closure(
                    t.type !== 'delimiter'|| t.status !== 'close' || t.identifier !== token.identifier,
                    token
                )
            },
            (t) => {
                container.childs.push(t)
            })

            // On met a jour la trace en fonction des enfants
            container.childsTrace()
            // On ajoute le conteneur au tableau
            this.output.splice(pos, this.i-pos+1, container)

            // On met a jour la position du curseur
            this.i = pos-1

        }

    }

//
