import { Tokenizer } from "./classes/Tokenizer.js";

console.log('file is loaded');

let code = `this
90
is`;

let app = new Tokenizer(code);

console.log(app.tokenize());