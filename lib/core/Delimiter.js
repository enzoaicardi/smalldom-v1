import { While } from "../assets/While.js"
import { Exception } from "../assets/Exception.js"
import { Item } from "../elements/Item.js"

// STEP 3

export class Delimiter extends While{

    constructor(items){
        super(items)
    }

    main(item){

        if(item.type === 'delimiter' && item.status === 'open'){

            let delimiter = new Item()
            let pos = this.i++
            delimiter.type = item.name

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
            
        } return false
    }

}
