import { Explorer } from "../../core/loops/Explorer.js"
import { Choices } from "./associations/Choices.js"
import { Comparators } from "./associations/Comparators.js"
import { Operators } from "./associations/Operators.js"

/**
 * Parcours le tableau de jetons et créer les associations via différents constructeurs
 */

    export class Associations extends Explorer{

        constructor(tokenList){
            super(tokenList)
        }

        run(){

            this.output = new Operators(this.output).run().output
            this.output = new Comparators(this.output).run().output
            this.output = new Choices(this.output).run().output

            return this

        }

    }

//