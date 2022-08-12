import { DynamicTyped } from "./Globals.js";

export class Token extends DynamicTyped {

    constructor(string){
        super();
        
        this.identifier = string || '';
        this.trace = false;
        this.acceptedTypes = ['word', 'number', 'br'];
    }

    get(){
        return {
            identifier: this.identifier,
            type: this.getType(),
            trace: this.trace
        };
    }

    value(value){
        this.identifier = value; 
    }

    addToValue(char){
        this.identifier += char;
    }
    
    setTrace(value){
        this.trace = value;
    }

}