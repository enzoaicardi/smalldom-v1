import { Super } from "./Super.js";

export class Comparators extends Super{

    constructor(tokenList){
        super(tokenList)
    }

    condition(token){
        return token.type === 'comparator'
    }

}