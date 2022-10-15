// Over The Dom

import { Joins } from "../primary/Joins.js";
import { Borders } from "../primary/Borders.js";
import { Delimiters } from "../primary/Delimiters.js";
import { Lexer } from "../primary/Lexer.js";
import { Imports } from "../primary/Imports.js";
import { Operations } from "../primary/Operations.js";
import { Rules } from "../builder/Rules.js";
import { Attributes } from "../builder/Attributes.js";
import { Eval } from "../primary/Eval.js";
import { Conditions } from "../primary/Conditions.js";
import { Variables } from "../primary/Variables.js";
import { Statements } from "../primary/Statements.js";
import { Voids } from "../primary/Voids.js";

Array.prototype.uuid = 0

let code = `
@aaa 'aaa' bbb
$bis is 2 $var is .love+(5+(5*$bis+3))

@import header from './exportbis/exportbis.sdom'
#header
$var@meta $var is `;

code = `
@if (a == a) {
    $var is bbb
    bbb
} 

@else {

    @if "" {
        $var is fff
    }

    @else {
        $var is ccc
    }
    
}
$var`

console.log(

    new Rules(
    new Attributes(

    new Eval(
    new Variables(
    new Imports(

    new Statements(
    new Conditions(
    new Operations(

    new Joins(
        new Delimiters(
            new Voids(
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
    ).run().array

    ).run().array
    ).run().array
    
)