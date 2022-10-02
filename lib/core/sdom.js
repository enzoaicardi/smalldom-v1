// Over The Dom

import { Joiner } from "./Joiner.js";
import { Border } from "./Border.js";
import { Delimiter } from "./Delimiter.js";
import { Lexer } from "./Lexer.js";
import { Replacer } from "./Replacer.js";
import { Collapser } from "./Collapser.js";
import { Attributer } from "./Attributer.js";
Array.prototype.uuid = 0

let code = `$var='lol'[link=200+$var love=aaa50]`;

console.log(
    new Attributer(
    new Collapser(
    new Replacer(
    new Joiner(
        new Delimiter(
            new Border(
                new Lexer(code).run().array
            ).run().array
        ).run().array
    ).run().array
    ).run().array
    ).run().array
    ).run().array
)