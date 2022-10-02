import { Exception } from "../assets/Exception.js";
import { While } from "../assets/While.js";

// Collapser > STEP 7 > 

export class Attributer extends While{

    constructor(items){
        super(items)
    }

    main(item){

        if(item.type === 'attribute'){
            item.attributes = {}
            new AttributeBuilder(item.childs, item).run()
        }

    }

}

class AttributeBuilder extends While{

    constructor(items, parent){
        super(items)
        this.parent = parent
    }

    main(item){

        if(item.type === 'symbol' && item.name !== 'brother') new Exception(this.parent, 'BAD_SYMBOL', this.uuid)

        else if(item.type === 'word'){

            item.type = 'attribute_name'
            let equal = this.whileVoid()

            if(equal.type !== 'symbol' || equal.name !== 'equal') {
                this.parent.attributes[item.value] = ''
                return
            }

            let value = this.whileVoid()

            if(value.type !== 'word' && value.type !== 'number' && value.type !== 'string') {
                this.parent.attributes[item.value] = ''
                new Exception(item, 'EMPTY', this.uuid)
                return
            }

            value.type = 'attribute_value'
            this.parent.attributes[item.value] = value.value

        }

    }

}