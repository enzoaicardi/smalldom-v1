import { Global } from "../assets/Global.js";
import { Location } from "../assets/Location.js";
import { While } from "../assets/While.js";
import { Exception } from "../assets/Exception.js";
import { Border } from "./Border.js";
import { Delimiter } from "./Delimiter.js";
import { Joiner } from "./Joiner.js";
import { Lexer } from "./Lexer.js";
import { Item } from "../elements/Item.js";

// Joiner > STEP 5 > Collapser

export class Replacer extends While{

    constructor(items){
        super(items)

        // On garde une copie locale des chemins d'import pour qu'ils ne se transmettent
        // pas entre les fichiers
        this.export = {}
        this.import = []
        this.path = (Global.path[this.uuid] || '')
    }

    main(item){

        this.item = item

        if(item.type === 'rule'){

            if(item.name === 'export'){

                let pos = this.i
                let name = this.whileVoid()
                if(name.type !== 'word') new Exception(item, 'NO_NAME', this.uuid)

                let block = this.whileVoid()
                if(block.type !== 'block') new Exception(item, 'EMPTY', this.uuid)

                else{

                    Global.doExport(this.uuid, name.value, block)

                    let el = new Item()
                    el.type = item.name
                    el.name = name.value
                    el.trace.bounds(item.trace, block.trace)

                    el.status = 'deep'
                    el.childs.uuid = this.uuid
                    el.childs.push(block)
                    
                    this.array.splice(pos, this.i-pos+1, el)
                    this.i = pos-1

                }

            }

            else if(item.name === 'import'){

                let pos = this.i
                let name = this.whileVoid()
                if(name.type !== 'word') new Exception(item, 'NO_NAME', this.uuid)
                item.identifier = name.value

                let keyword = this.whileVoid()
                let string = this.whileVoid()

                if((keyword.type !== 'word'
                || keyword.status !== 'keyword')
                || string.type !== 'string') new Exception(item, 'EMPTY', this.uuid)

                if(keyword.name === 'from'){

                    let path = this.path
                    path = Location.locate(path, string.value).location

                    if(!Global.import[path]) {Global.import[path] = this.exports(path); Global.doImport(this.uuid, path)}
                    if(!Global.import[path][name.value]) new Exception(item, 'NOT_FOUND', this.uuid)

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

        else if(item.type === 'variable'){

            let pos = this.i
            let equal = this.whileVoid()

            if(equal.type === 'symbol' && equal.name === 'equal'){

                let value = this.whileVoid()
                if(value.type !== 'string') {new Exception(item, 'EMPTY', this.uuid); return}

                value.name = item.type
                value.type = 'value'
                value.identifier = item.name
                Global.variable[item.name] = value

                item.value = value.value
                item.status = 'defined'
                item.trace.endBy(value.trace)

                this.array.splice(pos+1, this.i-pos); this.i = pos
            }

            else{
                
                let value = Global.variable[item.name] || null
                this.array.splice(pos, 1, value); this.i = pos

                if(!value) new Exception(item, 'NOT_FOUND', this.uuid);

            }

        }

        else if(item.type === 'reference'){

            let value = Global.doExport(this.uuid, item.name) || this.imports(item.name) || new Exception(item, 'NOT_FOUND', this.uuid)
            this.array.splice(this.i, 1, value);

        }

    }

    exports(path){

        let xhr = new XMLHttpRequest()
        xhr.open('GET', path, false)
        xhr.send();

        if(xhr.status != 200){
            new Exception(this.item, 'NOT_FOUND_FILE', this.uuid)
        }else{
            let res = xhr.responseText.replaceAll('\r\n', '\n')
            return Replacer.from(res, path)
        }

        new Exception(this.item, 'NOT_FOUND_FILE', this.uuid)
        return false
    }

    imports(name){

        let item = false
        this.import = Global.doImport(this.uuid)

        for(let i=0;i<this.import.length;i++){
            let path = this.import[i]
            item = Global.import[path][name] || false
            if(item) break
        }

        return item

    }

    static from(code, path){

        let replacer = new Replacer(
            new Joiner(
                new Delimiter(
                    new Border(
                        new Lexer(code, path).run().array
                    ).run().array
                ).run().array
            ).run().array
        ).run()

        return Global.doExport(replacer.uuid)

    }

}