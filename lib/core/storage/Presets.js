
export class Presets{

    static html5(STARTPOINT){

        let output = [
            {
                type: 'element',
                selfClosing: true,
                value: '!DOCTYPE html',
                identifier: 'schema',
                childs: []
            },{
                type: 'element',
                value: 'html',
                childs: [
                    {type: 'element', value: 'head', childs: [
                        {type: 'element', value: 'meta', attributes: {charset: 'UTF-8'}, childs: [], selfClosing: true},
                        {type: 'element', value: 'meta', attributes: {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'}, childs: [], selfClosing: true},
                        {type: 'element', value: 'meta', attributes: {name: 'viewport', content: 'width=device-width, initial-scale=1.0'}, childs: [], selfClosing: true}
                    ]},
                    {type: 'element', value: 'body', childs: STARTPOINT.childs}
                ]
            }
        ]

        return output

    }

}