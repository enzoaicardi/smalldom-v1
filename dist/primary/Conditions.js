import { Operations } from "./Operations.js"


export class Conditions extends Operations{

    constructor(items){
        super(items)
        this.elType = 'condition'
    }

    condition(item){
        return item.type === 'symbol'
        && (item.name === 'equal'
        || item.name === 'equality'
        || item.name === 'difference')
    }

}