import { Exception } from "../assets/Exception.js";
import { Global } from "../core/Global.js";
import { While } from "../core/While.js";


export class Attributes extends While{

    constructor(items){
        super(items)
    }

    main(item){

        if(item.type === 'attribute'){

            item.attributes = {}
            item.status = false

            new Attribute(item.childs, item).run()

        } 

    }

}

class Attribute extends While{

    constructor(items, parent){
        super(items)
        this.parent = parent
    }

    main(item){
        
        if(item.type === 'symbol' && item.name === 'brother') return 

        else if(item.type === 'word') this.parent.attributes[item.value] = ''

        else if(item.type === 'condition' && item.name === 'equal'){

            let first = item.childs[0]
            let last = item.childs[1]

            if(first.type !== 'word' || !Global.isText(last)) new Exception(this.parent, 'EMPTY')

            first.type = 'attribute_name'
            last.type = 'attribute_value'

            this.parent.attributes[first.value] = last.value

        }

        else{
            new Exception(this.parent, 'BAD_SYMBOL')
        }

    }

}