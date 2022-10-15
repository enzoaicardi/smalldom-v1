import { While } from "../core/While.js"
import { Exception } from "../assets/Exception.js"
import { Global } from "../core/Global.js"

/**
 * Variable permet de définir des variables ou d'imprimer la valeur de celle-ci dans le code
 */

export class Variables extends While{

    constructor(items){
        super(items)
    }

    main(item){

        if(item.type === 'variable'){

            let pos = this.i
            let is = this.next()

            if(is.type === 'word' && is.name === 'is' && is.status === 'keyword'){

                let value = this.next(item)

                item.type = 'variable_declaration'
                item.status = 'deep'
                item.childs.uuid = this.uuid
                item.childs.push(value)

                this.array.splice(pos+1, this.i-pos)
                this.i = pos-1

            }

            else{
                
                let value = Global.variable[item.name] || null
                if(!value) new Exception(item, 'NOT_FOUND');

                this.array[pos] = value
                this.i = pos

            }

        }

        else if(item.type === 'variable_declaration'){
            Global.variable[item.name] = item.childs[0]
            item.status = false
        }

    }
    
}