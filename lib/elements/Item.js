import { Trace } from "./Trace.js"

export class Item{

    // Un item est l'objet par défaut, il permet de définir les jetons, les blocks, les elements...

    constructor(){
        this.type = 'any'
        this.name = 'default'
        this.status = false

        this.identifier = 'unamed'
        this.value = ''

        this.childs = []
        this.trace = new Trace()
    }

    childsTrace(){
        this.trace.bounds(this.childs[0].trace, this.childs[this.childs.length-1].trace)
    }

}