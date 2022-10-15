/**
 * Classes Imports
 */

import { Imports } from "./interpreter/sourcing/Imports.js";
import { Associations } from "./interpreter/grouping/Associations.js";
import { Containers } from "./interpreter/grouping/Containers.js";
import { Lexer } from "./interpreter/lexing/Lexer.js";

export class sdom{

    static transpile(code){

        console.log(

            new Associations(
            new Imports(
            new Containers(
            new Lexer(
                code
            ).run().output
            ).run().output
            ).run().output
            ).run().output

        )

    }

}