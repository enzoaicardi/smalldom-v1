/**
 * IMPORTS
 */
import { Exception } from '../../../lib/core/tools/Exception.js';
import { Lexer } from '../../../lib/interpreter/lexing/Lexer.js'
import { Containers } from '../../../lib/interpreter/grouping/Containers.js'
import { Assignments } from '../../../lib/interpreter/grouping/associations/Assignments.js';
//

/**
 * WEBPACK IGNORE
 */
    let vscode = __non_webpack_require__('vscode');
//

/**
 * PROVIDER
 */

    const tokenTypes = [
        'word', 'number', 'string', 'variable', 'rule', 'reference', 'id',
        'class', 'boolean', 'comparator', 'choice', 'assignment', 'operator',
        'symbol', 'delimiter', 'attribute_key', 'attribute_value', 'comment',

        'container', 'group'
    ];

    const tokenModifiers = [
        'declaration', 'keyword', 'schema', 'double', 'single',
        'equality', 'difference', 'superior', 'inferior', 'and', 'or',
        'add', 'substract', 'multiply', 'devide', 'modulo', 'inline', 'block',
        'parent', 'brother', 'question', 'exclamation', 'attribute', 'group', 'eval'
    ];

    const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

    const provider = {
        provideDocumentSemanticTokens(document) {
            // analyze the document and return semantic tokens

            const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
            _Parse(document.getText(), tokensBuilder);

            return tokensBuilder.build();
            
        }
    };

    const selector = { language: 'sdom', scheme: 'file' };

    vscode.languages.registerDocumentSemanticTokensProvider(selector, provider, legend);

//

/**
 * TOKENIZER
 */


    function _Parse(code, tokensBuilder){

        Exception.mode = 'highlight';

        function _Map(tokenList){
            tokenList.forEach((token)=>{ _addToken(token, tokensBuilder); });
        }

        function _Attributes(tokenList, inAttribute){

            tokenList.forEach((token)=> {

                if(token.type === 'container'){
                    _Attributes(token.childs, token.identifier === 'attribute');
                }

                else if(inAttribute){

                    if(token.type === 'word'){

                        token.type = 'attribute_key'
                        _addToken(token, tokensBuilder);

                    }

                    else if(token.type === 'association'
                    && token.name === 'assignment'){

                        token.childs[0].type = 'attribute_key'
                        if(token.childs[1].type === 'word') {
                            token.childs[1].type = 'attribute_value'
                        }

                        _addToken(token.childs[0], tokensBuilder);
                        _addToken(token.childs[1], tokensBuilder);

                    }

                }

            })

        }

        let primaryTokens = new Lexer(code).comments(true).run().output
        let primaryTokensCopy = new Lexer(code).run().output

        let containerTokens = new Containers(primaryTokensCopy).run().output
        let assignmentTokens = new Assignments(containerTokens).run().output

        _Attributes(assignmentTokens)
        _Map(primaryTokens)

    }

    function _addToken(token, tokensBuilder){

        let start = token.trace.start;
        let end = token.trace.end;
        let maxCol = start.col + ((end.char+1) - start.char)

        let lines = (end.line - start.line) + 1;

        for(let i=0; i<lines; i++){

            tokensBuilder.push(
                new vscode.Range(
                    new vscode.Position(start.line + i, i ? 0 : start.col),
                    new vscode.Position(start.line + i, i === (lines-1) ? end.col+1 : maxCol)
                ),
                token.type,
                _addModifiers(token)
            );

        }

    }

    function _addModifiers(token){

        if(!token.identifier) {return [];}

        let index = tokenModifiers.indexOf(token.identifier)
        if(index+1 === 0) {return [];}
        
        return [token.identifier];

    }

//