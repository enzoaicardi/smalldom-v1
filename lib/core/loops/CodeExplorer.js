import { Trace } from "../objects/Trace.js";
import { Explorer } from "./Explorer.js";

/**
 * Représente une boucle sur un code
 * @extends Explorer
 * @constructor
 * @param {string} code - le code à explorer
 */

    export class CodeExplorer extends Explorer{

        constructor(code = ''){

            super()

            this.code = code
            this.source = this.code

            this.output = []
            this.output.uuid = this.uuid

            this.trace = new Trace()
            
        }
    
        while(condition, action, before = 0, after = 0){
    
            let code = this.code, start = 0
            let reset = true, br = false, escape = false
    
            for(this.i; this.i<code.length; this.i++, start++){
    
                let ignore = start < before
                
                let i = this.i

                if(!condition(code[i], i) && !ignore && !escape) {
                    this.i--
                    if(after) { this.i += after; this.trace.push(after) }
                    break
                }
                
                if(!reset) this.trace.push()
                
                if(br) { this.trace.break(); br = false }
                if(code[i] === '\n') br = true
                
                if(code[i] === '\\' && !escape) {
                    escape = true
                    reset = false
                    continue
                }
    
                // action
                if(action && !ignore) action(code[i], escape)

                escape = false
                reset = false
            }
    
        }

    }

//