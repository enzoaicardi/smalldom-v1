import { Global } from "./Global.js"

export class Exception{

    constructor(item, code, uuid){

        uuid = uuid || 0
        this.item = item
        code = code || 'default'

        this.parent =   Exception.repo[item.type] ? 
                        Exception.repo[item.type][item.name] ?  
                        Exception.repo[item.type][item.name] :  
                        Exception.repo :
                        Exception.repo

        this.type =     this.parent.type || 'fatal'
        this.code =     this.parent[code] ? code : 'default'
        this.message =  this.parent[code] || this.parent['default']

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
        let message = '('+this.code+') ['+ this.item.type + (this.item.name !== 'default' ? (', ' + this.item.name) : '') +'] - ' 

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
            }
        },

        rule: {
            export: {
                NO_NAME: 'You must specify a name for an @export declaration',
                EMPTY: 'You must declare a block after an @export declaration'
            },
            import: {
                EMPTY: 'You must declare a location after an @import declaration',
                NO_NAME: 'You must specify a name for an @import declaration',
                NOT_FIND: (i)=>{return 'No export found with the name ' + i.identifier},
                NOT_FOUND: 'File not found for that @import declaration',
            }
        },

        block: {
            default: {
                NO_CLOSURE: 'You must close every block by "}"'
            }
        },

        attribute: {
            default: {
                NO_CLOSURE: 'You must close every attribute by "]"'
            }
        },

        string: {
            default: {
                NO_CLOSURE: 'You must close every string by an apostrophe'
            }
        }

    }

}