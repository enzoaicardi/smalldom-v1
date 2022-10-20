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
import { Storage } from "./core/storage/Storage.js";

export class sdom{

    static tree(code){

        // Interpreter
        let ast = 
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

        // Traducer
        let tree = new Tree(ast).run()

        return tree

    }

    static transpile(code){

        // Parser
        let result = new Parser(
            sdom.tree(code),
            sdom.format
        ).run()

        // HTML
        return result

    }

    static behavior(name){
        // default, highlight, cli
        Storage.behavior = name
        return this
    }

    static layout(format){
        sdom.format = format
        return this
    }

    static format = 'minified'

}