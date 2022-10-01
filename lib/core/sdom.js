// Over The Dom

import { Joiner } from "./Joiner.js";
import { Border } from "./Border.js";
import { Delimiter } from "./Delimiter.js";
import { Lexer } from "./Lexer.js";
import { Replacer } from "./Replacer.js";
Array.prototype.uuid = 0

let code = `@export data {data}html
@import header from './exportbis/exportbis.sdom'
`;

console.log(
    new Replacer(
    new Joiner(
        new Delimiter(
            new Border(
                new Lexer(code).run().array
            ).run().array
        ).run().array
    ).run().array
    ).run().array
)