import { Exception } from "../assets/Exception.js"
import { Global } from "../assets/Global.js"
import { While } from "../assets/While.js"

// Replacer > STEP 6 > Attributer

export class Collapser extends While{

    constructor(items){
        super(items)
        this.previous
        this.pos = this.i
    }

    main(item){

        if(Global.isVoid(item)) return
        if(item.type === 'symbol' && item.name === 'collapse'){

            let last = this.whileVoid()
            if(last === item || Global.isVoid(last)) new Exception(last, 'NO_CLOSURE', this.uuid)

            last.value = this.previous.value += last.value
            if(this.previous.type === 'value') this.array[this.pos] = last
            
            this.array.splice(this.pos+1, this.i-this.pos)
            this.i = this.pos-1

            return

        }

        this.pos = this.i
        this.previous = item

    }

}