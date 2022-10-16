import { Super } from "./Super.js";

export class Assignments extends Super{

    constructor(tokenList){
        super(tokenList)
    }

    condition(token){

        // Si le jeton est précédé d'une variable alors on change son type
        // Cela permet de ne pas évaluer le nom d'une variable que l'on veut assigner lors de l'évaluation
        if(token.type === 'assignment'
        && this.before()
        && this.before().type === 'variable'){

            token.identifier = 'variable'
            this.before().identifier = 'assignment'

        }

        return token.type === 'assignment'

    }

}