import { While } from "../assets/While.js";
import { Exception } from "../assets/Exception.js";
import { Item } from "../elements/Item.js";

// Delimiter > STEP 4 > Replacer

export class Joiner extends While{

    constructor(items){
        super(items)
    }

    main(item){

        if(item.type === 'word' && (
            item.value === 'from' ||
            item.value === 'as' ||
            item.value === 'is'
        )){
            item.name = item.value
            item.status = 'keyword'
        }

        else if(item.type === 'symbol'){

            if(
                item.name === 'rule' ||
                item.name === 'reference' ||
                item.name === 'class' ||
                item.name === 'variable'
            ) this.ItemBlankWord(item)

        }

    }

    ItemBlankWord(item){

        let pos = this.i
        let last = this.whileBlank()

        if(last.type === 'word'){

            let el = new Item()
            el.type = item.name
            el.name = last.value
            el.value = last.value
            el.trace.bounds(item.trace, last.trace)

            this.array.splice(pos, this.i-pos+1, el)
            this.i = pos

        } else new Exception(item, 'NO_NAME', this.uuid)

    }

}