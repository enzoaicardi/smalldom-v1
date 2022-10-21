
/**
 * Contient tous les messages pouvant êtres utilisés dans la librairie
 */

    export class Message{

        static error = {

            default: 'An error has occurred',

            BAD_RESULT: {
                container: {
                    type: 'warn',
                    eval: 'Your "eval" container expression return more than one result'
                }
            },

            BAD_VALUE: {
                default: (token) => { return 'Some values are wrong in your '+token.identifier+' '+token.type },
                association: (token) => { return 'Some values are incompatible in your '+token.identifier+' '+token.name }
            },

            BAD_TYPE: (token) => { return 'The type '+token.type+' "'+token.value+'" is not allowed in this declaration' },

            NOT_FOUND: {
                variable: (token) => { return 'No variable found with the name '+token.value }
            },

            NO_DECLARATION: (token) => { return 'You must specify a declaration after "'+token.value+'" statement' },
            NO_CONDITION: (token) => { return 'You must specify a condition after "'+token.value+'" statement' },

            NO_STATEMENT: (token) => { return 'Statement "'+token.value+'" must be preceded by an "if" or "elseif" statement' },

            NO_PRESET: (token) => { return 'No preset found with the name '+token.value },

            NO_KEYWORD: {
                import: 'Keyword "from" is missing in you import declaration'
            },

            NO_CLOSURE: {
                default: (token) => { return 'You must close every '+token.type },
                delimiter: (token) => { return 'You must close every '+token.identifier+' container' },
            },

            NO_IMPORT: {
                default: (token) => { return 'No export found with the name "'+token.value+'"'},
                import: (token) => { return 'No export found with the name "'+token.value+'"'},
                reference: (token) => { return 'No import found with the name "'+token.value+'"'},
            },

            NO_BOUNDS: (token) => { return 'Argument missing in '+token.identifier+' '+token.type },

            NO_NAME: (token) => { return 'You must specify a name for '+token.type+' '+token.identifier },

            NO_FILE: (token) => { return 'No file found for this '+token.type+' '+token.identifier },

            EMPTY: (token) => { return 'Your '+token.type+' '+token.identifier+' is empty' },

            NaN: {
                association: (token) => { return 'Second argument must be a number after '+token.identifier+' '+token.name }
            }

        }

    }

//