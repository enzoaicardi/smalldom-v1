import { Global } from "../core/Global.js"

export class Exception{

    constructor(item, code){

        this.item = item
        let uuid = this.item.uuid
        
        code = code || 'default'
        this.basecode = code

        this.parent =   Exception.repo[item.type] ? 
                        Exception.repo[item.type][item.name] ?  
                        Exception.repo[item.type][item.name] :  
                        Exception.repo[item.type] :
                        Exception.repo

        this.type =     this.parent.type || 'fatal'
        this.code =     this.parent[code] ? code : 'default'
        this.message =  this.parent[code] || this.parent['default'] || Exception.repo['default']

        this.text = Global.data[uuid]
        this.path = Global.path[uuid]

        this.send()

    }

    send(){

        // trace

        let start = this.item.trace.start
        let end = this.item.trace.end
        let startChar = start.char-start.col
        let endChar = this.getLines(3, startChar)

        // build

        let view = this.text.substring(startChar, endChar)

        // code + type
        let message = '('+this.basecode+') ['+ this.item.type + (this.item.name !== 'default' ? (', ' + this.item.name) : '') +'] - ' 

        // display repo message
        message += (typeof this.message === 'function' ? this.message(this.item) : this.message) + '\n\n'

        // display code review
        message += '*----\n' + view + '\n----*\n\n'
        
        // display trace
        message += (this.path ? ('from: ' + this.path + '\n\n') : '')
        message += 'start (' + Object.entries(start).map((el)=>{return el.join(': ')}).join(', ') + ')\n'
        message += '  end (' + Object.entries(end).map((el)=>{return el.join(': ')}).join(', ') + ')\n'

        // display

        if(this.type !== 'warn'){
            console.error(message)
            throw 'fatal error'
        }

        console.warn(message)

    }

    getLines(num, start){

        let end = start, lines = 0

        for(var i = start; i<this.text.length; i++, end++){
            let char = this.text[i]
            if(char === '\n') lines++
            if(lines > num) break
        }

        return end

    }

    static repo = {

        default: 'An error has occurred',

        // symbols

        symbol: {
            class: {
                type: 'warn',
                NO_NAME: 'You must specify a name for that class "." declarator'
            },
            reference: {
                type: 'warn',
                NO_NAME: 'You must specify a name for that reference "#" declarator'
            },
            rule: {
                type: 'warn',
                NO_NAME: 'You must specify a name for that rule "@" declarator'
            },
            variable: {
                type: 'warn',
                NO_NAME: 'You must specify a name for that variable "$" declarator'
            },
            plus: {
                NO_CLOSURE: 'You must declare an element after a plus "+" declarator'
            },
            lass: {
                NO_CLOSURE: 'You must declare a number after a less "-" declarator'
            },
            multiply: {
                NO_CLOSURE: 'You must declare a number after a multiplier "*" declarator',
                BAD_VALUE: 'You must declare a number after a multiplier "*" declarator'
            }
        },

        // delimiters & borders

        string: {
            NO_CLOSURE: 'You must close every string by an apostrophe'
        },

        block: {
            NO_CLOSURE: 'You must close every block by "}"'
        },

        eval: {
            NO_CLOSURE: 'You must close every parenthesis by ")"'
        },

        attribute: {
            NO_CLOSURE: 'You must close every attribute by "]"',
            BAD_SYMBOL: 'Only brother "," and equal "=" symbols are allowed in attributes'
        },

        attribute_name: {
            type: 'warn',
            EMPTY: 'Equal "=" symbol must be followed by a string in attribute declaration',
        },

        // rules & vars

        rule: {

            type: 'warn',
            EMPTY: (i)=>{return 'The @' + i.name + ' rule is empty'},

            export: {
                NO_NAME: 'You must specify a name for an @export declaration',
                EMPTY: 'You must declare a block after an @export declaration'
            },
            import: {
                EMPTY: 'You must declare a location after an @import declaration',
                NO_NAME: 'You must specify a name for an @import declaration',
                NOT_FOUND: (i)=>{return 'No export found with the name ' + i.identifier},
                NOT_FOUND_FILE: 'File not found for that @import declaration',
            },

            if: {
                EMPTY: 'You must declare a condition and an element after @if statement',
            },
            elseif: {
                EMPTY: 'You must declare a condition and an element after @elseif statement',
                MISSING: 'You must declare an @if statement before @elseif statement'
            },
            else: {
                EMPTY: 'You must declare an element after @else statement',
                MISSING: 'You must declare an @if or @elseif statement before @else statement'
            }

        },

        variable: {
            EMPTY: 'Keyword "is" must be followed by a value in variable declaration',
            NOT_FOUND: (i)=>{return 'No variable found with the name ' + i.name},
        },

        reference: {
            NOT_FOUND: (i)=>{return 'No reference found with the name ' + i.name},
        },

        // collapse

        collapse: {

            less: {
                BAD_VALUE: 'Less "-" operator work only with two numbers'
            },

            multiply: {
                BAD_VALUE: 'Multiply "*" operator must be followed by a number'
            },

        }

    }

}