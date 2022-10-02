import { While } from "../assets/While.js"
import { Exception } from "../assets/Exception.js"
import { Item } from "../elements/Item.js"

// Lexer > STEP 2 > Delimiter

export class Border extends While{

    constructor(items){
        super(items)
    }

    main(item){

        if(item.type === 'border'){

            let border = new Item()
            let pos = this.i++
            border.type = item.name
            border.name = item.status

            this.while(
            (i)=>{
                let cond = (i.type !== 'border' || i.name !== item.name || i.status !== item.status) && i.type !== item.identifier
                if(item.name !== 'comment' && this.i === this.array.length-1 && cond) new Exception(border, 'NO_CLOSURE', this.uuid)
                return cond
            },
            (i)=>{
                border.value += i.value
                border.childs.push(i)
                border.childsTrace()
            })

            this.array.splice(pos, this.i-pos+1, border)
            this.i = pos

        }

    }

}