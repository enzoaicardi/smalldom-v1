import { Global } from "../assets/Global.js";
import { Location } from "../assets/Location.js";
import { While } from "../assets/While.js";
import { Exception } from "../assets/Exception.js";
import { Border } from "./Border.js";
import { Delimiter } from "./Delimiter.js";
import { Joiner } from "./Joiner.js";
import { Lexer } from "./Lexer.js";
import { Item } from "../elements/Item.js";

// STEP 5

export class Replacer extends While{

    constructor(items){
        super(items)

        this.export = {}
        this.variable = {}
        this.path = (Global.path[this.uuid] || '')
    }

    main(item){

        this.item = item

        if(item.type === 'rule'){

            if(item.name === 'export'){

                let pos = this.i
                let name = this.whileVoid()
                if(name.type !== 'word') new Exception(item, 'NO_NAME')

                let block = this.whileVoid()
                if(block.type !== 'block') new Exception(item, 'EMPTY')

                else{

                    this.export[name.value] = block

                    let el = new Item()
                    el.type = item.name
                    el.name = name.value
                    el.trace.bounds(item.trace, block.trace)

                    el.childs.uuid = this.uuid
                    el.childs.push(block)
                    
                    this.array.splice(pos, this.i-pos+1, el)
                    this.i = pos

                }

            }

            else if(item.name === 'import'){

                let pos = this.i
                let name = this.whileVoid()
                if(name.type !== 'word') new Exception(item, 'NO_NAME')
                item.identifier = name.value

                let keyword = this.whileVoid()
                let string = this.whileVoid()

                if((keyword.type !== 'word'
                || keyword.status !== 'keyword')
                || string.type !== 'string') new Exception(item, 'EMPTY')

                if(keyword.name === 'from'){

                    let path = this.path
                    path = Location.locate(path, string.value).location

                    if(!Global.import[path]) Global.import[path] = this.exports(path)
                    if(!Global.import[path][name.value]) new Exception(item, 'NOT_FIND')

                    let el = new Item()
                    el.type = item.name
                    el.name = name.value
                    el.value = path
                    el.trace.bounds(item.trace, string.trace)

                    this.array.splice(pos, this.i-pos+1, el)
                    this.i = pos

                }

            }

        }

    }

    exports(path){

        let xhr = new XMLHttpRequest()
        xhr.open('GET', path, false)
        
        try {
            xhr.send();

            if(xhr.status != 200){
                new Exception(this.item, 'NOT_FOUND')
            }else{
                let res = xhr.responseText.replaceAll('\r\n', '\n')
                return Replacer.from(res, path)
            }

        }catch(err){
            new Exception(this.item, 'NOT_FOUND')
        }

        return false
    }

    static from(code, path){

        return new Replacer(
            new Joiner(
                new Delimiter(
                    new Border(
                        new Lexer(code, path).run().array
                    ).run().array
                ).run().array
            ).run().array
        ).run().export

    }

}