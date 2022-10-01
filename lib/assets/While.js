import { Exception } from "./Exception.js"
import { Trace } from "../elements/Trace.js"

export class While{

    constructor(items){
        this.i = 0

        this.array = items || []
        this.uuid = this.array.uuid
        
        this.trace = false
        this.text = ''
        this.colorise = false
    }

    main(){}

    color(){
        this.colorise = true
        return this
    }

    run(trace){

        if(trace) this.trace.startFrom(trace)
        // console.log(this.text.length || this.array.length)

        this.while(
        ()=>{return true},
        (item)=>{ this.main(item, this.i) })

        return this

    }

    while(condition, action){

        let items = this.array

        for(this.i; this.i<items.length; this.i++){

            let i = this.i

            if(!condition(items[i], i)) break;
            action(items[i], i)

        }

        return this.array[this.i] || this.array[this.i-1]

    }

    whileBlank(){
        this.i++
        return this.while((i)=>{return i.type === 'blank'},()=>{})
    }

    whileVoid(){
        this.i++
        return this.while((i)=>{return i.type === 'blank' || i.type === 'break'},()=>{})
    }

}

export class WhileText extends While{

    constructor(text){
        super()
        this.text = text || ''
        this.trace = new Trace()
    }

    while(condition, action){

        let text = this.text, reset = true, br = false

        for(this.i; this.i<text.length; this.i++){

            let i = this.i
            if(!condition(text[i], i)) { this.i -= 1; break; }

            if(!reset) this.trace.push()

            if(br) { this.trace.break(); br = false }
            if(text[i] === '\n') br = true

            action(text[i], i)
            reset = false
        }

        return this.text[this.i]

    }
}