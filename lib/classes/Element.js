import { DynamicTyped } from "./Globals.js";

export class Element extends DynamicTyped {

    constructor(name){
        super();

        this.name = name;
        this.childs = [];
        this.acceptedTypes = ['tag', 'text']
    }

    get(){
        return {
            name: this.name,
            type: this.getType(),
            childs: this.childs
        };
    }

    addChild(element){
        this.childs.push(element);
    }

    getChild(element){
        return this.childs.find( e => e === element );
    }

    hasChild(element){
        return this.childs.findIndex( e => e === element ) === -1 ? false : true;
    }

}