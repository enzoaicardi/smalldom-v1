// Over The Dom

import { Border } from "./Border.js";
import { Delimiter } from "./Delimiter.js";
import { Lexer } from "./Lexer.js";

let code = `
html {
    body [dark-mode="true"] {
        article
            nav
                h1 "my nav"
    }
}`;

console.log(
    new Delimiter().run(
        new Border().run( 
            new Lexer().run(code).array
        ).array
    ).array
)