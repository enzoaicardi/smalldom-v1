import { Trace } from "./Trace.js"

export class Item{

    // Un item est l'objet par défaut, il permet de définir les jetons, les blocks, les elements...

    constructor(uuid){

        this.uuid = uuid || 0
        
        this.type = 'any'
        this.name = 'default'
        this.status = false
        this.attributes = {}

        this.identifier = false
        this.value = ''
        this.count = 1

        this.childs = []
        this.childs.uuid = this.uuid
        this.trace = new Trace()

    }

    childsTrace(){
        this.trace.bounds(this.childs[0].trace, this.childs[this.childs.length-1].trace)
    }

    clone(item){

        this.uuid = item.uuid
        
        this.type = item.type
        this.name = item.name
        this.status = item.status
        this.attributes = item.attributes
        
        this.identifier = item.identifier
        this.value = item.value
        this.count = item.count

        this.childs = item.childs
        this.trace = item.trace

        return this

    }

}