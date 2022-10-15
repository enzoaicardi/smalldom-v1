
export class Location{

    static locate(path, extra){

        if(!path) return {location: extra}

        if(/\/[^/]*\.[^/]*$/.test(path) || /\/$/.test(path)) path = path.replace(/\/[^/]*$/, '')

        if(/^\.\.\//.test(extra) && /\/[^/]*$/.test(path)) {

            extra = extra.replace(/^\.\.\//, '/')
            path = path.replace(/\/[^/]*$/, '')

            let locate = Location.locate(path, extra)
            extra = locate.extra
            path = locate.path

        }

        else if(/^\.\//.test(extra)){

            extra = extra.replace(/^\.\//, '/')

            let locate = Location.locate(path, extra)
            extra = locate.extra
            path = locate.path

        }

        return {
            path: path,
            extra: extra,
            location: path + extra
        }

    }

}