import { Super } from "./Super.js";

export class Choices extends Super{

    constructor(tokenList){
        super(tokenList)
    }

    condition(token){
        return token.type === 'choice'
    }

}