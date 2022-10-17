import { Explorer } from "../../core/loops/Explorer.js";
import { Token } from "../../core/objects/Token.js";

/**
 * Parcours le tableau de jeton et créer l'arbre DOM
 */

    export class Tree{

        constructor(tokenList){

            this.i = 0
            this.list = tokenList
            this.head = []

            this.body =
            this.output = new Token(this.uuid).set({
                type: 'body'
            })

            this.body.trace.start.col = -1

            this.run(this.body)

        }

        run(parent){

            let previousElement = false
            let forceChild = false

            for(this.i; this.i < this.list.length; this.i++){

                let token = this.list[this.i]
                let before = this.list[this.i-1] || false
                let after = this.list[this.i+1] || false

                if(token.type === 'word') token.type = 'element'

                if(token.type === 'element'){

                    // Si le jeton à une place moins élevée dans la colonne
                    console.log('level token', this.levelOf(token))
                    console.log('level parent', this.levelOf(parent))

                    if(this.levelOf(token) <= this.levelOf(parent) && !forceChild) return;

                    parent.childs.push(token)

                    this.i++
                    this.run(token)

                }

            }

            return this

        }

        levelOf(token){
            return token.trace.start.col
        }

    }