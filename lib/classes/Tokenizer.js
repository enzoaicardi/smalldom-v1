import { Token } from "./Token.js";
import { Trace } from "./Trace.js";

class TokenList {

    constructor(){
        this.list = [];
    }

    addToken(token){
        this.list.push(token);
    }

}

export class Tokenizer {

    constructor(string, initial){
        this.code = string;
        this.i = initial || 0;
        this.list = new TokenList;
    }

    tokenize(){

        // testers

        const BLANK = /\s/;
        const LETTER = /[a-z]/i;
        const NUMBER = /\d/;
        const LETTER_NUMBER = /[\w\d]/;

        // init values

        let i = this.i;
        let code = this.code;
        let length = code.length;

        // init stackTrace

        let stackTrace = new Trace;

        // explore loop

        function forWhile(condition, callback, minus){

            for(i; i<length; i++){

                if(!condition(code[i], i)) { i -= minus || 1; break; }
                callback(code[i], i);

                stackTrace.addChar();
                stackTrace.addCol();

                if(code[i] === '\n') {
                    stackTrace.addLine();
                    stackTrace.setCol();
                }

            }

        }

        // init main loop

        forWhile(
            () => {return true;},
            (char) => {

            // init token

            let token = new Token;
            let trace = new Trace;
            trace.set(stackTrace.get('end'), 'start');

            // condition gate

            if(LETTER.test(char)){
                // inToken loop
                forWhile(
                    (c) => { return LETTER.test(c) || c === '-'; },
                    (c) => {
                        token.setType('word');
                        token.addToValue(c);
                    }
                );
            }

            else if(NUMBER.test(char)){
                forWhile(
                    (c) => { return NUMBER.test(c); },
                    (c) => {
                        token.setType('number');
                        token.addToValue(c);
                    }
                );
            }

            else {

                if(/\n/.test(char)) token.setType('br');
                else if(/'/.test(char)) token.setType('string_delimiter_single');
                else if(/"/.test(char)) token.setType('string_delimiter_double');

                // else ?
                token.addToValue(char);

            }

            // finally

            trace.set(stackTrace.get('end'), 'end');
            token.setTrace(trace.get());
            this.list.addToken(token.get());

        });

        return this.list;

    }

}