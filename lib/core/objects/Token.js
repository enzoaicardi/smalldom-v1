
import { Trace } from "./Trace.js"

/**
 * Représente un jeton
 * @constructor
 * @param {number} uuid - identifiant unique qui correspond au jeton
 */

    export class Token{

        // Chaque jeton possède un uuid qui référence le code duquel il est issu
        constructor(uuid = 0){

            this.uuid = uuid
            this.type = 'any'

            this.identifier = false
            this.name = false

            this.attributes = {}
            this.status = false
            this.count = 1
            this.childs = []

            // le tableau des enfants doit avoir le même uuid, cela permet de créer des jetons sur ce tableau avec une transmission d'uuid
            this.childs.uuid = this.uuid

            // deep permet de savoir si les enfants du jeton seront explorés
            this.deep = false
            
            // trace correspond à la trace de pile du jeton
            this.trace = new Trace()
            this.value = ''

        }

        set(properties){
            for(let key in properties) this[key] = properties[key]
            return this
        }

        childsTrace(){
            this.trace.bounds(
                this.childs[0].trace,
                this.childs[this.childs.length-1].trace
            )
        }

    }

//