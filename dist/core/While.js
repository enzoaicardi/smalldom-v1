import { Exception } from "../assets/Exception.js"
import { Trace } from "../elements/Trace.js"

export class While{

    constructor(items){
        this.i = 0

        this.array = items || []
        this.uuid = this.array.uuid
        
        this.trace = false
        this.text = ''
        this.colorise = false

        this.undefined = {
            type: 'undefined',
            name: 'undefined',
            status: false,
            identifier: false
        }
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
        (item)=>{ 
            if(item.status === 'deep') { /* console.log(this.constructor.name); */ new this.constructor(item.childs).run()}
            this.main(item, this.i)
        })

        return this

    }

    while(condition, action){

        let items = this.array

        for(this.i; this.i<items.length; this.i++){

            let i = this.i

            if(!condition(items[i], i)) break;
            action(items[i], i)

        }

        return this.array[this.i] || this.undefined

    }

    next(item, code){

        this.i++
        let value = this.array[this.i] || this.undefined

        if(value.status === 'deep') { new this.constructor(value.childs).run() }
        else if(item && value === this.undefined) new Exception(item, code || 'EMPTY');

        return value

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