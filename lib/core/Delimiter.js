import { While } from "../assets/While.js"
import { Item } from "../elements/Item.js"

// STEP 3

export class Delimiter extends While{

    constructor(){
        super()
    }

    main(item){

        if(item.type === 'delimiter' && item.status === 'open'){

            let delimiter = new Item()
            delimiter.start = this.i
            delimiter.type = item.name

            this.i++
            this.while(
            (i)=>{return i.type !== 'delimiter' || i.name !== item.name || i.status !== 'close'},
            (i)=>{
                if(this.main(i)) return
                delimiter.value += i.value
                delimiter.childs.push(i)
            })
            
            delimiter.childsTrace()
            this.array.splice(delimiter.start, this.i-delimiter.start+1, delimiter)
            this.i = delimiter.start-1

            return true
            
        } return false
    }

}
