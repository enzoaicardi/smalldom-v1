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
import { Parser } from "./traducer/parsing/Parser.js";

export class sdom{

    static transpile(code){

        // Interpreter
        let ast = new Assesser(
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
        
        // Traducer
        let tree = new Tree(ast).run()
        let result = new Parser(tree).layout('preformatted').run()

        // LOG

        console.log(ast)
        console.log(result)

    }

}