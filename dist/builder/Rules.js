import { Exception } from "../assets/Exception.js";
import { Global } from "../core/Global.js";
import { While } from "../core/While.js";
import { Item } from "../elements/Item.js";


export class Rules extends While{

    constructor(items){
        super(items)
    }

    main(item){

        if(item.type !== 'rule') return

        let pos = this.i
        let el = new Item(this.uuid)
        el.type = item.name

        let first = this.next()
        if(!this.ruleSet(el, first)) {new Exception(item, 'EMPTY'); return}

        let second = this.next()
        if(first.type !== second.type) this.ruleSet(el, second)

        item.status = 'defined'
        if(item.name === 'script' && !el.attributes.defer) el.attributes.defer = 'true'

        this.array.splice(pos+1, this.i-pos)
        this.i = pos

        if(item.name === 'preset') Global.preset.push(el)
        else Global.head.push(el)

    }

    ruleSet(item, last){

        if(last.type === 'attribute') item.attributes = last.attributes
        else if(last.type === 'string') {
            item.childs.uuid = this.uuid
            item.childs.push(last)
        }else{this.i--; return false}
        return true

    }

}