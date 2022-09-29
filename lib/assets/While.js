import { Trace } from "../elements/Trace.js"

export class While{

    constructor(){
        this.i = 0
        this.array = []
        this.trace = false
    }

    source(value){
        return this.array = value || this.array
    }

    main(){}

    run(items, trace){

        if(items) this.source(items)
        if(trace) this.trace.startFrom(trace)

        console.log(this.source().length)

        this.while(
        ()=>{return true},
        (item)=>{ this.main(item) })

        return this

    }

    while(condition, action){

        let items = this.source()

        for(this.i; this.i<items.length; this.i++){

            let i = this.i

            if(!condition(items[i], i)) break;
            action(items[i], i)

        }

    }
}

export class WhileText extends While{

    constructor(){
        super()
        this.text = ''
        this.trace = new Trace()
    }

    source(value){
        return this.text = value || this.text
    }

    while(condition, action){

        let text = this.source(), reset = true

        for(this.i; this.i<text.length; this.i++){

            let i = this.i
            if(!condition(text[i], i)) { this.i -= 1; break; }

            // si la condition est vraie
            action(text[i], i)
            if(!reset || i === 0) this.trace.push()
            reset = false
        }

    }
}