

export class Storage{

    static persistence = true

    static behavior = 'default'
    
    /*
    code = [
        sourceCode
        ...
    ]
    index is uuid
    */
        static code = []
    //

    /*
    path = {
        uuid: ./path
        ...
    }
    */
        static path = {}
    //

    /*
    export = {
        path: {
            name: token
            ...
        }
        ...
    }
    */
        static export = {}
    //

    /*
    import = {
        uuid: {
            name: ./path
            ...
        }
        ...
    }
    */
        static import = {}
    //

    /*
    variable = {
        uuid: {
            name: value
        }
        ...
    }
    */
        static variable = {}
    //

}