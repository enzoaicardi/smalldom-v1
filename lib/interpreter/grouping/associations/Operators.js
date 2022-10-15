import { Super } from "./Super.js";

export class Operators extends Super{

    constructor(tokenList){
        super(tokenList)
    }

    condition(token){
        return token.type === 'operator'
    }

}