import { While } from "../core/While.js"
import { Global } from "../core/Global.js"

/**
 * Borders créer les types string
 */

export class Voids extends While{

    constructor(items){
        super(items)
        this.cleaner = []
        this.cleaner.uuid = this.array.uuid
    }

    main(item){

        if(Global.isVoid(item)) {}
        else this.cleaner.push(item)

        if(this.i === this.array.length-1) this.array = this.cleaner;

    }

}