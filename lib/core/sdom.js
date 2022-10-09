// Over The Dom

import { Joins } from "../primary/Joins.js";
import { Borders } from "../primary/Borders.js";
import { Delimiters } from "../primary/Delimiters.js";
import { Lexer } from "../primary/Lexer.js";
import { References } from "../primary/References.js";
import { Collapser } from "../primary/Collapser.js";
import { Rules } from "../builder/Rules.js";
import { Attributes } from "../builder/Attributes.js";
import { Eval } from "../primary/Eval.js";
import { Conditions } from "../primary/Conditions.js";
Array.prototype.uuid = 0

let code = `$bis=2$var .love*(5+(5*$bis+3))

@import header from './exportbis/exportbis.sdom'
#header
$var`;

code = `
$var is [a=2] + ([b=3] + [c=4])$var
@style './css'`

console.log(
    new Rules(
    new Attributes(

    new Eval(
    new References(
    new Conditions(
    new Collapser(
    new Joins(
        new Delimiters(
            new Borders(
                new Lexer(code).run().array
            ).run().array
        ).run().array
    ).run().array
    ).run().array
    ).run().array
    ).run().array
    ).run().array

    ).run().array
    ).run().array
)