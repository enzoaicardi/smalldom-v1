import { CodeExplorer } from "../../core/loops/CodeExplorer.js"
import { Token } from "../../core/objects/Token.js"
import { Storage } from "../../core/storage/Storage.js"
import { Exception } from "../../core/tools/Exception.js"

/**
 * Parcours le code et renvoie un tableau contenant les jetons primaires
 * @param {string} code - le code source
 * @param {string} path - le chemin du code dans le cas d'un import
 */

    export class Lexer extends CodeExplorer{

        constructor(code, path = ''){
            
            super(code)

            // On stocke le code du fichier dans un tableau pour pouvoir le récupérer plus
            // tard en cas d'erreur
            this.uuid =
            this.output.uuid = Storage.code.push(this.code) - 1
            
            // On stocke le chemin relatif du fichier duquel provient le code
            // Sa référence est this.uuid
            Storage.path[this.uuid] = path

            console.log(this.code.length)

        }

        main(char, escape){

            // Expressions régulières
            const BLANK = /\s/;
            const LETTER = /[a-z]/i;
            const NUMBER = /\d/;
            const LETTER_NUMBER = /[\w\d-]/;
            const LETTER_DASH = /[a-z-]/i;

            let token = new Token(this.uuid)
            token.trace.startFrom(this.trace)

            let two = false

            // Primitifs ignorés

                if(escape) return

                else if(BLANK.test(char)) return

            // Primitifs dynamiques
            
                else if(LETTER.test(char)){

                    token.type = 'word'

                    this.while(
                    (c)=>{return LETTER_NUMBER.test(c) || c === ':'},
                    (c)=>{ token.value += c })

                    // On ajoute les mots clé
                    if(token.value === 'is'
                    || token.value === 'from') token.identifier = 'keyword'

                    // is devient un opérateur d'assignement comme =
                    if(token.value === 'is') token.type = 'assignment'

                    
                }

                else if(NUMBER.test(char)){

                    token.type = 'number'

                    this.while(
                    (c)=>{return NUMBER.test(c)},
                    (c)=>{ token.value += c })

                }

                else if(/(\$|@|#|&|\.)/.test(char)) {

                    const type = 
                        char === '$' ? 'variable' :
                        char === '@' ? 'rule' :
                        char === '&' ? 'reference' :
                        char === '#' ? 'id' :
                        char === '.' ? 'class' : null

                    token.type = type
                    token.identifier = 'declaration'

                    this.while(
                    (c)=>{return LETTER_DASH.test(c)},
                    (c)=>{ token.value += c }, 1)

                    if(token.value.length < 1) new Exception(token, 'NO_NAME')

                }

                else if(char === "'" || char === '"') {

                    token.type = 'string'
                    token.identifier = char === '"' ? 'double' : 'single'

                    this.while(
                    (c)=>{return this.closure(c !== char, token)},
                    (c)=>{ token.value += c }, 1, 1)

                }

                else if(char === '/' && this.after() === '/') {

                    token.type = 'comment'
                    token.identifier = 'inline'

                    this.while(
                    (c)=>{return c !== '\n'},
                    (c)=>{ token.value += c }, 2)

                }

                else if(char === '/' && this.after() === '*') {

                    token.type = 'comment'
                    token.identifier = 'block'

                    this.while(
                    (c)=>{return c !== '*' || this.after() !== '/'},
                    (c)=>{ token.value += c }, 2, 2)

                }

            // Primitifs statiques

            else{

                // Comparateurs

                    if(char === '=' && this.after() === '='){
                        two = true
                        token.type = 'comparator'
                        token.identifier = 'equality'
                    }

                    else if(char === '!' && this.after() === '='){
                        two = true
                        token.type = 'comparator'
                        token.identifier = 'difference'
                    }

                    else if(char === '>' && this.after() === '>'){
                        two = true
                        token.type = 'comparator'
                        token.identifier = 'superior'
                    }

                    else if(char === '<' && this.after() === '<'){
                        two = true
                        token.type = 'comparator'
                        token.identifier = 'inferior'
                    }

                // Opérateurs de choix

                    else if(char === '&' && this.after() === '&'){
                        two = true
                        token.type = 'choice'
                        token.identifier = 'and'
                    }

                    else if(char === '|' && this.after() === '|'){
                        two = true
                        token.type = 'choice'
                        token.identifier = 'or'
                    }

                // Operateurs d'assignement

                    else if(char === '=') {
                        token.type = 'assignment'
                    }

                // Opérateurs mathématiques

                    else if(char === '+') {
                        token.type = 'operator'
                        token.identifier = 'add'
                    }

                    else if(char === '-') {
                        token.type = 'operator'
                        token.identifier = 'substract'
                    }

                    else if(char === '*') {
                        token.type = 'operator'
                        token.identifier = 'multiply'
                    }

                    else if(char === '/') {
                        token.type = 'operator'
                        token.identifier = 'divide'
                    }

                    else if(char === '%') {
                        token.type = 'operator'
                        token.identifier = 'modulo'
                    }

                // Symbols

                    else if(char === '>') {
                        token.type = 'symbol'
                        token.identifier = 'parent'
                    }

                    else if(char === '<') {
                        token.type = 'symbol'
                        token.identifier = 'child'
                    }

                    else if(char === ',') {
                        token.type = 'symbol'
                        token.identifier = 'brother'
                    }

                    else if(char === '?') {
                        token.type = 'symbol'
                        token.identifier = 'question'
                    }

                    else if(char === '!') {
                        token.type = 'symbol'
                        token.identifier = 'exclamation'
                    }

                // Conteneurs

                    else if(char === '[') {
                        token.type = 'delimiter'
                        token.identifier = 'attribute'
                        token.status = 'open'
                    }

                    else if(char === ']') {
                        token.type = 'delimiter'
                        token.identifier = 'attribute'
                        token.status = 'close'
                    }

                    else if(char === '{') {
                        token.type = 'delimiter'
                        token.identifier = 'group'
                        token.status = 'open'
                    }

                    else if(char === '}') {
                        token.type = 'delimiter'
                        token.identifier = 'group'
                        token.status = 'close'
                    }

                    else if(char === '(') {
                        token.type = 'delimiter'
                        token.identifier = 'eval'
                        token.status = 'open'
                    }

                    else if(char === ')') {
                        token.type = 'delimiter'
                        token.identifier = 'eval'
                        token.status = 'close'
                    }

                // Oppérations communes à tous les primitifs statiques

                token.value += char

                if(two) {
                    this.trace.push()
                    token.value += this.after()
                    this.i++
                }

            }

            // On pousse le jeton dans la liste
            token.trace.endBy(this.trace)
            this.output.push(token)

        }

    }

//