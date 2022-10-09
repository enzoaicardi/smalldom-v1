import { While } from "../core/While.js"
import { Exception } from "../assets/Exception.js"
import { Item } from "../elements/Item.js"

/** DEEP
 * Delimiters permet de créer des blocks distinct dans le code
 * ce qui permet de regrouper des jetons en un seul
 */

export class Delimiters extends While{

    constructor(items){
        super(items)
    }

    main(item){

        if(item.type !== 'delimiter' || item.status !== 'open') return false

        let delimiter = new Item(this.uuid)
        let pos = this.i++
        delimiter.type = item.name
        delimiter.status = 'deep'
        delimiter.childs.uuid = this.uuid
        
        this.while(
        (i)=>{
            let cond = i.type !== 'delimiter' || i.name !== item.name || i.status !== 'close'
            if(this.i === this.array.length-1 && cond) new Exception(delimiter, 'NO_CLOSURE')
            return cond
        },
        (i)=>{
            if(this.main(i)) return
            delimiter.value += i.value
            delimiter.childs.push(i)
            delimiter.childsTrace()
        })
            
        this.array.splice(pos, this.i-pos+1, delimiter)
        this.i = pos-1

        return true

    }

}
