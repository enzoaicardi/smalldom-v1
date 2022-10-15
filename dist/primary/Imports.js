import { Global } from "../core/Global.js";
import { Location } from "../assets/Location.js";
import { While } from "../core/While.js";
import { Exception } from "../assets/Exception.js";
import { Borders } from "./Borders.js";
import { Delimiters } from "./Delimiters.js";
import { Joins } from "./Joins.js";
import { Lexer } from "./Lexer.js";
import { Item } from "../elements/Item.js";
import { Operations } from "./Operations.js";
import { Conditions } from "./Conditions.js";
import { Voids } from "./Voids.js";
import { Statements } from "./Statements.js";

/** GLOBAL
 * Imports permet d'importer des bouts de code depuis d'autres fichiers .sdom
 */

export class Imports extends While{

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
                let name = this.next()
                if(name.type !== 'word') new Exception(item, 'NO_NAME')

                let block = this.next()
                if(block.type !== 'block') new Exception(item, 'EMPTY')

                else{

                    Global.doExport(this.uuid, name.value, block)

                    let el = new Item(this.uuid)
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
                let name = this.next()
                
                if(name.type !== 'word') new Exception(item, 'NO_NAME')
                item.identifier = name.value

                let keyword = this.next()
                let string = this.next()

                if((keyword.type !== 'word'
                || keyword.status !== 'keyword')
                || string.type !== 'string') new Exception(item, 'EMPTY')

                if(keyword.name === 'from'){

                    let path = this.path
                    path = Location.locate(path, string.value).location

                    if(!Global.import[path]) {Global.import[path] = this.exports(path); Global.doImport(this.uuid, path)}
                    if(!Global.import[path][name.value]) new Exception(item, 'NOT_FOUND')

                    let el = new Item(this.uuid)
                    el.type = item.name
                    el.name = name.value
                    el.value = path
                    el.trace.bounds(item.trace, string.trace)

                    this.array.splice(pos, this.i-pos+1, el)
                    this.i = pos

                }

            }

        }

        else if(item.type === 'reference'){

            let value = Global.doExport(this.uuid, item.name) || this.imports(item.name) || new Exception(item, 'NOT_FOUND')
            this.array.splice(this.i, 1, value);

        }

    }

    exports(path){

        let xhr = new XMLHttpRequest()
        xhr.open('GET', path, false)
        xhr.send();

        if(xhr.status != 200){
            new Exception(this.item, 'NOT_FOUND_FILE')
        }else{
            let res = xhr.responseText.replaceAll('\r\n', '\n')
            return Imports.from(res, path)
        }

        new Exception(this.item, 'NOT_FOUND_FILE')
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

        // le passage par les différents constructeurs va mettre automatiquement à jour
        // les propriétés statiques de Global, et c'est ça qui nous intéresse
        let res = Global.construct(
            [Borders, Voids, Delimiters, Joins, Operations, Conditions, Statements, Imports],
            new Lexer(code, path).run().array
        )

        return Global.doExport(res.uuid)

    }

}