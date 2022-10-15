import { Message } from "./Message.js"
import { Storage } from "../../core/storage/Storage.js"

/**
 * Permet de lever une exception
 * @constructor
 * @param {Token} token - le jeton qui déclenche l'erreur
 * @param {string} code - le code d'erreur pour générer le message
 */

    export class Exception{

        constructor(token, code = 'default'){

            this.token = token
            this.errorCode = code
            
            // On récupère le block contenant le message d'erreur
            this.parent =   Message.error[code] ? 
                            Message.error[code][token.type] ?  
                            Message.error[code][token.type] :
                            Message.error[code] :
                            Message.error['default']

            // On récupère le type d'erreur sur le block d'erreur si disponible
            this.errorType =     this.parent.type || 'fatal'

            // On récupère le message d'erreur sur le block d'erreur
            this.message =  this.parent[token.identifier] 
                        ||  this.parent['default']
                        ||  this.parent

            // On récupère le code source et le chemin du code source depuis l'uuid du jeton
            let uuid = this.token.uuid
            this.sourceCode = Storage.code[uuid]
            this.path = Storage.path[uuid]

            // On envoie l'exception
            this.send()

        }

        send(){

            // Récupération de la trace et du code

                let start = this.token.trace.start
                let end = this.token.trace.end
                
                let startChar = start.char-start.col
                let endChar = this.getLines(3, startChar)

                let view = this.sourceCode.substring(startChar, endChar)


            // Création du message

                // code + type
                let message = '('+this.errorCode+') ['+ this.token.type + (this.token.identifier ? (', ' + this.token.identifier) : '') +'] - ' 

                // display repo message
                message += (typeof this.message === 'function' ? this.message(this.token) : this.message) + '\n\n'

                // display code review
                message += '*----\n' + view + '\n----*\n\n'
                
                // display trace
                message += (this.path ? ('from: ' + this.path + '\n\n') : '')
                message += 'start (' + Object.entries(start).map((el)=>{return el.join(': ')}).join(', ') + ')\n'
                message += '  end (' + Object.entries(end).map((el)=>{return el.join(': ')}).join(', ') + ')\n'


            // Affichage du message

                if(this.errorType !== 'warn'){
                    console.error(message)
                    throw 'fatal error'
                }

                console.warn(message)


        }

        // permet d'obtenir le nombre de caractères correspondant à n (num) lignes
        getLines(num, start){

            let end = start, lines = 0

            for(var i = start; i<this.sourceCode.length; i++, end++){

                let char = this.sourceCode[i]
                if(char === '\n') lines++
                if(lines > num) break

            }

            return end

        }

    }

//