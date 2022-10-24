/**
 * Classes Imports
 */

import { Associations } from "./interpreter/grouping/Associations.js";
import { Containers } from "./interpreter/grouping/Containers.js";
import { Statements } from "./interpreter/grouping/Statements.js";
import { ImportsCLI } from "./interpreter/sourcing/ImportsCLI.js";
import { Assesser } from "./interpreter/evaluation/Assesser.js";
import { Imports } from "./interpreter/sourcing/Imports.js";
import { Storage } from "./core/storage/Storage.js";
import { Parser } from "./traducer/parsing/Parser.js";
import { Lexer } from "./interpreter/lexing/Lexer.js";
import { Tree } from "./traducer/building/Tree.js";

export class sdom{

    /**
     * Lexing
     */
        // [Default] lexer qui renvoie les jetons primaires et conteneurs
        static lexing(code, path = ''){

            return new Containers(
            new Lexer(
                code, path
            ).run().output
            ).run().output

        }

        // [CLI - Promise] renvoie les jetons primaire, les conteneurs, et ajoute les imports (ne gère pas exports et références)
        static lexingCLI(code, path = ''){

            // On fait un lexing synchrone
            let lex = sdom.lexing(code, path)

            // On retourne une promesse qui se résout en renvoyant...
            return new Promise(function(resolve) {
                // Le résultat de ImportsCLI (propre au CLI) lorsque tous les jetons ont été explorés
                new ImportsCLI(lex, resolve).run()
            });

        }
    //

    /**
     * Tree - obtient l'arbre DOM sous forme d'objet javascript
     */
        static tree(lexing){

            // Interpreter
            let ast = 
            new Assesser(
            new Statements(
            new Associations(
            new Imports(
                lexing
            ).run().output
            ).run().output
            ).run().output
            ).run().output

            // Traducer
            let tree = new Tree(ast).run()

            return tree

        }
    //

    /**
     * Compile un code source en .sdom en .html
     * @param {string} code - le code source à compiler
     * @returns - HTML ou Promesse (CLI)
     */

        static transpile(code){

            let a = ["aaa"]
            a.root = {uuid: 4, root: 2}
            console.log('a = ', a)

            // Si on est dans le CLI
            if(Storage.behavior === 'cli'){

                // On retourne une promesse qui se résout en renvoyant le résultat de la compilation
                return new Promise(function(resolve, reject) {

                    // On lance un lexing asynchrone
                    sdom.lexingCLI(code).then((lexing)=>{

                        // A la fin de ce lexing on compile le résultat
                        let result = new Parser(
                            // DOM js
                            sdom.tree(lexing),
                            sdom.format
                        ).run()

                        // On résout la promesse en renvoyant le résultat
                        resolve(result)

                    }).catch((err)=>{
                        console.log(err)
                        reject(err)
                    })

                });

            }

            // Si on est en dehors du CLI
            else{

                // On compile le code
                let result = new Parser(
                    sdom.tree(
                        sdom.lexing(code)
                    ),
                    sdom.format
                ).run()

                // On retourne le code
                return result

            }

        }

    //

    /**
     * Options
     */

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

    //

}