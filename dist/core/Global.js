
export class Global{
    // stocker les imports de fichiers répertoriés par URL

    static data = []            // code - by uuid
    static path = {}            // path - by uuid
    static import = {}          // all imports - by path
    static variable = {}        // all variables - by name

    static head = []            // all head tags
    static preset = []          // all doc presets

    static import_local = {}    // all import paths - by uuid
    static export_local = {}    // all exports - by uuid

    static doExport(id, name, item){
        if(!Global.export_local[id]) Global.export_local[id] = {}
        if(item) Global.export_local[id][name] = item
        if(name) return Global.export_local[id][name]
        return Global.export_local[id]
    }

    static doImport(id, path){
        if(!Global.import_local[id]) Global.import_local[id] = []
        if(path) Global.import_local[id].push(path)
        return Global.import_local[id]
    }

    static isVoid(item){
        return item.type === 'blank' || item.type === 'break'
    }

    static isText(item){
        return item.type === 'string' || item.type === 'word' || item.type === 'number'
    }

    static isNumber(item){
        return item.type === 'number'
    }

    static construct(ctx, array){

        let instance = false
        for(let i=0; i<ctx.length; i++){
            instance = new ctx[i](array).run()
            array = instance.array
        }

        return instance
        
    }

}