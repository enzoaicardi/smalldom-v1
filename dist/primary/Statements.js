import { Exception } from "../assets/Exception.js"
import { While } from "../core/While.js"
import { Global } from "../core/Global.js"
import { Eval } from "./Eval.js"
import { Variables } from "./Variables.js"

export class Statements extends While{

    constructor(items){
        super(items)
        this.previous = false
    }

    main(item){

        if(Global.isVoid(item)) return

        else if(item.type === 'rule'
        && (item.name === 'if' || item.name === 'elseif' || item.name === 'else')){

            const isElse = item.name === 'else'

            if(this.before(item).miss) new Exception(item, 'MISSING')
            
            let pos = this.i
            let cond = isElse ? false : this.next(item)
            let element = this.next(item)

            if(cond) cond = Global.construct([Variables, Eval], [cond]).array[0]

            item.type = 'statement'
            this.array.splice(pos+1, this.i-pos)
            this.i = pos

            if((cond.value && (item.name === 'if' || (item.name === 'elseif' && this.previous.identifier === 'failed')))
            || (item.name === 'else' && this.previous.identifier === 'failed')){

                item.status = 'deep'
                item.identifier = 'success'
                item.childs.push(element)

            }
            else item.identifier = 'failed'

        }

        this.previous = item

    }

    before(item){

        return {
            miss: item.name !== 'if' && (!this.previous || this.previous.type !== 'statement' || this.previous.name === 'else'),
            cond: item.name !== 'if' && this.previous.identifier === 'success'
        }
    }

}