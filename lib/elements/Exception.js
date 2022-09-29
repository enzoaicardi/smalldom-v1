
export class Exception{

    constructor(item, code){

        this.item = item
        code = code || 'default'

        this.parent =   Exception.repo[item.type] ? 
                        Exception.repo[item.type][item.name] ?  
                        Exception.repo[item.type][item.name] :  
                        Exception.repo['default'] :
                        Exception.repo['default']

        this.type =     this.parent.type || 'warn'
        this.code =     this.parent[code] ? code : 'default'
        this.message =  this.parent[code] || this.parent['default']

    }

    send(){
        let message = '['+this.code+'] - ' + this.message + '\n\n'
        // ajouter trace + review de code
        // message += Object.entries(this.item.trace.start) + '\n'
        console.log()
    }

    static repo = {

        default: 'An error has occurred',

        symbol: {
            type: 'warn',
            class: {
                O_NO_NAME: 'You must specify a name for that class selector'
            }
        }

    }

}