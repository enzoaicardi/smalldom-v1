/**
 * Classes Imports
 */

import { Imports } from "./interpreter/sourcing/Imports.js";
import { Associations } from "./interpreter/grouping/Associations.js";
import { Containers } from "./interpreter/grouping/Containers.js";
import { Lexer } from "./interpreter/lexing/Lexer.js";
import { Statements } from "./interpreter/grouping/Statements.js";
import { Assesser } from "./interpreter/evaluation/Assesser.js";
import { Tree } from "./traducer/building/Tree.js";

export class sdom{

    static transpile(code){

        console.log(

            // Traducer
            new Tree(

            // Interpreter
            new Assesser(
            new Statements(
            new Associations(
            new Imports(
            new Containers(
            new Lexer(
                code
            ).run().output
            ).run().output
            ).run().output
            ).run().output
            ).run().output
            ).run().output
            
            ).run().output

        )

    }

}