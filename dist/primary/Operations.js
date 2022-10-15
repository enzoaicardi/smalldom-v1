import { Exception } from "../assets/Exception.js"
import { Global } from "../core/Global.js"
import { While } from "../core/While.js"
import { Item } from "../elements/Item.js"

/** DEEP
 * Operations permet de regrouper deux jetons en un seul à partir d'un opérateur
 * (+, -, *, ...) qui sera évalué plus tard
 */

export class Operations extends While{

    constructor(items){
        super(items)
        this.previous
        this.pos = this.i

        this.elType = 'collapse'
    }

    main(item){

        if(Global.isVoid(item)) return

        else if(this.condition(item)){

            let last = this.next(item, 'NO_CLOSURE')

            let el = new Item(this.uuid)
            el.type = this.elType
            el.name = item.name
            el.status = 'deep'
            el.childs.uuid = this.uuid

            el.childs.push(this.previous, last)
            el.childsTrace()
            
            this.array.splice(this.pos, this.i-this.pos+1, el)
            this.i = this.pos-1

            return

        }

        this.pos = this.i
        this.previous = item

    }

    condition(item){
        return item.type === 'symbol'
        && (item.name === 'plus'
        || item.name === 'less'
        || item.name === 'multiply')
    }

}