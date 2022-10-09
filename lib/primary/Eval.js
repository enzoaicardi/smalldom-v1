import { While } from "../core/While.js"
import { Exception } from "../assets/Exception.js"
import { Item } from "../elements/Item.js"

/**
 * Eval renvoie tout les enfants d'un groupe de type "eval" après qu'ils aient été évalués
 * Tous les items collapse sont calculés puis renvoyés sous la forme d'un item unique
 */

export class Eval extends While{

    constructor(items){
        super(items)
    }

    main(item){

        if(item.type === 'eval'){
            
            this.array.splice(this.i, 1, ...item.childs)

        }

        // equal doit servir pour les déclarations et n'est dont pas évalué
        else if(item.type === 'collapse'){

            let first = item.childs[0]
            let last = item.childs[1]

            // il est necessaire de cloner l'Item sans quoi chaque référence
            // à la variable modifie la variable elle même
            let el = new Item().clone(first)

            if(first.type === 'number' && last.type === 'number'){

                if(item.name === 'plus') el.value = Number(first.value) + Number(last.value)
                else if(item.name === 'less') el.value = Number(first.value) - Number(last.value)
                else if(item.name === 'multiply') el.value = Number(first.value) * Number(last.value)

            }

            else if(last.type === 'number'){

                if(item.name === 'plus') el.value += last.value
                else if(item.name === 'less') new Exception(item, 'BAD_VALUE')
                else if(item.name === 'multiply') el.count = Number(last.value)

            }

            else if(item.name === 'plus'){

                if((first.type === 'block' && last.type === 'block')
                || (first.type === 'attribute' && last.type === 'attribute')) {
                    el.childs.push(...last.childs)
                    el.childsTrace()
                }
                
                el.value += last.value

            }

            else{
                new Exception(item, 'BAD_VALUE')
            }

            this.array[this.i] = el

        }

        else if(item.type === 'condition'){
            
            // ... update this to add conditionnal logic ...
            item.status = false

        }

    }
    
}