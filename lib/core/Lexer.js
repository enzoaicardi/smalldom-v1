import { Global } from "../assets/Global.js";
import { WhileText } from "../assets/While.js"
import { Item } from "../elements/Item.js"

// STEP 1 > Border

export class Lexer extends WhileText{

    // Le lexer permet d'obtenir un ensemble de jetons et de leur attribuer un type, ...

    constructor(text, path){
        super(text)
        // on met a jour l'uuid du tableau, qui va se transmettre entre les Classes pour garder
        // le texte original pour les exceptions
        this.path = path || ''
        this.uuid = this.array.uuid = Global.data.push(this.text) - 1
        Global.path[this.uuid] = path

        console.log(this.text.length)
    }

    // Methode commune

    main(char){

        // regex
        const BLANK = /[^\S\n]/;
        const LETTER = /[a-z]/i;
        const NUMBER = /\d/;
        const LETTER_NUMBER = /[\w\d]/;

        let item = new Item(); item.trace.startFrom(this.trace)

        if(LETTER.test(char)){

            item.type = 'word'

            this.while(
            (c)=>{return LETTER_NUMBER.test(c) || c === '-' || c === ':'},
            (c)=>{ item.value += c })
            
        }

        else if(NUMBER.test(char)){

            item.type = 'number'

            this.while(
            (c)=>{return NUMBER.test(c) || c === '.'},
            (c)=>{ item.value += c })

        }

        else if(BLANK.test(char)){

            item.type = 'blank'

            this.while(
            (c)=>{return BLANK.test(c)},
            (c)=>{ item.value += c })

        }

        else{

            if(char === '\n') {
                item.type = 'break'
            }

            // symbols

            else if(char === '$') {
                item.type = 'symbol'
                item.name = 'variable'
            }

            else if(char === '@') {
                item.type = 'symbol'
                item.name = 'rule'
            }

            else if(char === '#') {
                item.type = 'symbol'
                item.name = 'reference'
            }

            else if(char === '.') {
                item.type = 'symbol'
                item.name = 'class'
            }

            else if(char === '=') {
                item.type = 'symbol'
                item.name = 'equal'
            }

            else if(char === '+') {
                item.type = 'symbol'
                item.name = 'collapse'
            }

            else if(char === '>') {
                item.type = 'symbol'
                item.name = 'parent'
            }

            else if(char === ',') {
                item.type = 'symbol'
                item.name = 'brother'
            }

            // borders

            else if(char === "'") {
                item.type = 'border'
                item.name = 'string'
                item.status = 'single'
            }

            else if(char === '"') {
                item.type = 'border'
                item.name = 'string'
                item.status = 'double'
            }

            else if(char === '/' && this.text[this.i+1] === '/') {
                this.i++; item.value += char
                item.type = 'border'
                item.name = 'comment'
                item.status = 'inline'
                item.identifier = 'break'
            }

            // delimiters

            else if(char === '[') {
                item.type = 'delimiter'
                item.name = 'attribute'
                item.status = 'open'
            }

            else if(char === ']') {
                item.type = 'delimiter'
                item.name = 'attribute'
                item.status = 'close'
            }

            else if(char === '{') {
                item.type = 'delimiter'
                item.name = 'block'
                item.status = 'open'
            }

            else if(char === '}') {
                item.type = 'delimiter'
                item.name = 'block'
                item.status = 'close'
            }

            item.value += char

        }

        // On pousse l'item dans la liste
        item.trace.endBy(this.trace)
        this.array.push(item)

    }

}