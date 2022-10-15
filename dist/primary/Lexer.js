import { Global } from "../core/Global.js";
import { WhileText } from "../core/While.js"
import { Item } from "../elements/Item.js"

/** GLOBAL
 * Le Lexer analyse l'ensemble des caractères du code et en ressort
 * un tableau de jetons avec (type, nom, status, childs, ...)
 */

export class Lexer extends WhileText{

    /**
     * @param {string} text le code source
     * @param {string} path le chemin du code dans le cas d'un import
     */

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

        let item = new Item(this.uuid); item.trace.startFrom(this.trace)
        let next = this.text[this.i+1]
        let useNext = false

        if(LETTER.test(char)){

            item.type = 'word'

            this.while(
            (c)=>{return LETTER_NUMBER.test(c) || c === '-' || c === ':'},
            (c)=>{ item.value += c })
            
        }

        else if(NUMBER.test(char)){

            item.type = 'number'

            this.while(
            (c)=>{return NUMBER.test(c)},
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

            // conditions

            else if(char === '=' && next === '='){
                useNext = true
                item.type = 'symbol'
                item.name = 'equality'
            }

            else if(char === '!' && next === '='){
                useNext = true
                item.type = 'symbol'
                item.name = 'difference'
            }

            else if(char === '>' && next === '='){
                useNext = true
                item.type = 'symbol'
                item.name = 'superior'
            }

            else if(char === '<' && next === '='){
                useNext = true
                item.type = 'symbol'
                item.name = 'inferior'
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

            else if(char === '>') {
                item.type = 'symbol'
                item.name = 'parent'
            }

            else if(char === ',') {
                item.type = 'symbol'
                item.name = 'brother'
            }

            else if(char === '?') {
                item.type = 'symbol'
                item.name = 'question'
            }

            else if(char === '!') {
                item.type = 'symbol'
                item.name = 'exclamation'
            }

            // collapse

            else if(char === '=') {
                item.type = 'symbol'
                item.name = 'equal'
            }

            else if(char === '+') {
                item.type = 'symbol'
                item.name = 'plus'
            }

            else if(char === '-') {
                item.type = 'symbol'
                item.name = 'less'
            }

            else if(char === '*') {
                item.type = 'symbol'
                item.name = 'multiply'
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

            else if(char === '/' && next === '/') {
                useNext = true
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

            else if(char === '(') {
                item.type = 'delimiter'
                item.name = 'eval'
                item.status = 'open'
            }

            else if(char === ')') {
                item.type = 'delimiter'
                item.name = 'eval'
                item.status = 'close'
            }

            item.value += char

            if(useNext) {
                this.i++
                item.value += next
            }

        }

        // On pousse l'item dans la liste
        item.trace.endBy(this.trace)
        this.array.push(item)

    }

}