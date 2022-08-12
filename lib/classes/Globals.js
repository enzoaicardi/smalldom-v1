export class DynamicTyped {

    constructor(){
        this.acceptedTypes = [];
        this.type = 'any';
    }

    canType(value){
        return this.acceptedTypes.find( e => e === value );
    }

    setType(value){
        if(this.canType(value)) this.type = value;
    }

    getType(value){
        return this.type;
    }

}