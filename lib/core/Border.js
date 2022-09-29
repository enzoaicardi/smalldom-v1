import { While } from "../assets/While.js"
import { Item } from "../elements/Item.js"

// STEP 2

export class Border extends While{

    constructor(){
        super()
    }

    main(item){

        if(item.type === 'border'){

            let border = new Item()
            border.start = this.i
            border.type = item.name
            border.name = item.status

            this.i++
            this.while(
            (i)=>{return i.type !== 'border' || i.name !== item.name || i.status !== item.status},
            (i)=>{
                border.value += i.value
                border.childs.push(i)
            })

            border.childsTrace()
            this.array.splice(border.start, this.i-border.start+1, border)
            this.i = border.start

        }

    }

}