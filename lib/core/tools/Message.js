
/**
 * Contient tous les messages pouvant êtres utilisés dans la librairie
 */

    export class Message{

        static error = {

            default: 'An error has occurred',

            BAD_KEYWORD: {
                import: 'Keyword "from" is missing in you import declaration'
            },

            NO_CLOSURE: {
                default: (token) => { return 'You must close every '+token.type },
                delimiter: (token) => { return 'You must close every '+token.identifier+' container' },
            },

            NO_NAME: (token) => { return 'You must specify a name for '+token.type+' '+token.identifier },

            NO_FILE: (token) => { return 'No file found for this '+token.type+' '+token.identifier },

            EMPTY: (token) => { return 'Your '+token.type+' '+token.identifier+' is empty' },

        }




        

        static past = {

            default: 'An error has occurred',

            // symbols

            symbol: {
                class: {
                    type: 'warn',
                    NO_NAME: 'You must specify a name for that class "." declarator'
                },
                reference: {
                    type: 'warn',
                    NO_NAME: 'You must specify a name for that reference "#" declarator'
                },
                rule: {
                    type: 'warn',
                    NO_NAME: 'You must specify a name for that rule "@" declarator'
                },
                variable: {
                    type: 'warn',
                    NO_NAME: 'You must specify a name for that variable "$" declarator'
                },
                plus: {
                    NO_CLOSURE: 'You must declare an element after a plus "+" declarator'
                },
                lass: {
                    NO_CLOSURE: 'You must declare a number after a less "-" declarator'
                },
                multiply: {
                    NO_CLOSURE: 'You must declare a number after a multiplier "*" declarator',
                    BAD_VALUE: 'You must declare a number after a multiplier "*" declarator'
                }
            },

            // delimiters & borders

            string: {
                NO_CLOSURE: 'You must close every string by an apostrophe'
            },

            block: {
                NO_CLOSURE: 'You must close every block by "}"'
            },

            eval: {
                NO_CLOSURE: 'You must close every parenthesis by ")"'
            },

            attribute: {
                NO_CLOSURE: 'You must close every attribute by "]"',
                BAD_SYMBOL: 'Only brother "," and equal "=" symbols are allowed in attributes'
            },

            attribute_name: {
                type: 'warn',
                EMPTY: 'Equal "=" symbol must be followed by a string in attribute declaration',
            },

            // rules & vars

            rule: {

                type: 'warn',
                EMPTY: (t)=>{return 'The @' + t.identifier + ' rule is empty'},

                export: {
                    NO_NAME: 'You must specify a name for an @export declaration',
                    EMPTY: 'You must declare a block after an @export declaration'
                },
                import: {
                    EMPTY: 'You must declare a location after an @import declaration',
                    NO_NAME: 'You must specify a name for an @import declaration',
                    NOT_FOUND: (t)=>{return 'No export found with the name ' + t.identifier},
                    NOT_FOUND_FILE: 'File not found for that @import declaration',
                },

                if: {
                    EMPTY: 'You must declare a condition and an element after @if statement',
                },
                elseif: {
                    EMPTY: 'You must declare a condition and an element after @elseif statement',
                    MISSING: 'You must declare an @if statement before @elseif statement'
                },
                else: {
                    EMPTY: 'You must declare an element after @else statement',
                    MISSING: 'You must declare an @if or @elseif statement before @else statement'
                }

            },

            variable: {
                EMPTY: 'Keyword "is" must be followed by a value in variable declaration',
                NOT_FOUND: (t)=>{return 'No variable found with the name ' + t.identifier},
            },

            reference: {
                NOT_FOUND: (t)=>{return 'No reference found with the name ' + t.identifier},
            },

            // collapse

            collapse: {

                less: {
                    BAD_VALUE: 'Less "-" operator work only with two numbers'
                },

                multiply: {
                    BAD_VALUE: 'Multiply "*" operator must be followed by a number'
                },

            }

        }

    }

//