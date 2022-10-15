import { While } from "../core/While.js";
import { Exception } from "../assets/Exception.js";
import { Item } from "../elements/Item.js";

/**
 * Joins permet de fusionner des jetons pour obtenir des jetons d'un nouveau
 * type primaire, qui font plus de sens (classes, références, mots clé, règles)
 */

export class Joins extends While{

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
        let last = this.next()

        if(last.type === 'word'){

            let el = new Item(this.uuid)
            el.type = item.name
            el.name = last.value
            el.value = last.value
            el.trace.bounds(item.trace, last.trace)

            this.array.splice(pos, this.i-pos+1, el)
            this.i = pos

        } else new Exception(item, 'NO_NAME')

    }

}