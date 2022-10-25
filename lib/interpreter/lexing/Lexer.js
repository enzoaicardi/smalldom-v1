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

        constructor(code, meta = {}){
            
            super(code)

            // A chaque nouveau code source on créer un UUID pour le stocker dans les meta
            // Sauf si le code source est déjà stocké dans le tableau, on récupère l'index qui devient l'UUID
            let uuid = Storage.behavior === 'highlight' ? 0 :
            Storage.behavior === 'cli' && Storage.code.indexOf(code) !== -1 ? Storage.code.indexOf(code) :
            (Storage.code.push(this.code) - 1)

            // On regarde si on a un chemin dans les meta, si c'est le cas on le stocke
            let path = meta.path || ''

            // Si on a un root dans meta cela veut dire qu'on est dans un import
            let root = 
                typeof meta.root === 'undefined' ? uuid : meta.root

            // On stocke les metas dans le tableau de retour afin de transmettre ces meta à tous les autres constructeurs
            this.meta =
            this.output.meta = {uuid, path, root}

            // Permet d'activer l'affichage des commentaires
            // A manier avec prudence, cela cause des erreurs logiques dans le processus de transpilation
            this.commentsEnabled = false

            // On nettoie les variables si on est dans le fichier racine (hors imports)
            if(uuid === root){
                Storage.variable[root] = {}
            }

        }

        // Permet d'activer ou de désactiver l'impression des commentaires
        comments(bool){

            this.commentsEnabled = bool
            return this
            
        }

        main(char, escape){

            // Expressions régulières
            const BLANK = /\s/;
            const LETTER = /[a-z]/i;
            const NUMBER = /\d/;
            const LETTER_NUMBER = /[\w\d-]/;
            const LETTER_DASH = /[a-z-]/i;

            let token = new Token(this.meta)
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

                // balise schema XML
                else if(char === '!'
                && LETTER.test(this.after())){

                    token.type = 'word'
                    token.identifier = 'schema'
                    token.value = '!'

                    this.while(
                    (c)=>{return c !== '\n' && c !== '!'},
                    (c)=>{ token.value += c }, 1)

                }

                else if(NUMBER.test(char)){

                    token.type = 'number'

                    this.while(
                    (c)=>{return NUMBER.test(c)},
                    (c)=>{ token.value += c })

                    // On transforme la valeur en nombre
                    token.value = Number(token.value)

                }

                else if(/(\$|@|#|&|\.)/.test(char)
                && (char !== '&' || this.after() !== '&')) {

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

                    // Si le jeton est une règle équivalente à @true ou @false on la transforme en booléen
                    if(type === 'rule'
                    && (token.value === 'true'
                    || token.value === 'false')){

                        token.set({type: 'boolean', identifier: false, value: token.value === 'true' })
                        
                    }

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

                    // On imprime pas les commentaires dans le tableau
                    if(!this.commentsEnabled) return;

                }

                else if(char === '/' && this.after() === '*') {

                    token.type = 'comment'
                    token.identifier = 'block'

                    this.while(
                    (c)=>{return c !== '*' || this.after() !== '/'},
                    (c)=>{ token.value += c }, 2, 2)

                    // On imprime pas les commentaires dans le tableau
                    if(!this.commentsEnabled) return;

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