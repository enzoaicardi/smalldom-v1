import { Exception } from "../tools/Exception.js";

/**
 * Représente une boucle sur un tableau de jetons
 * @constructor
 * @param {Array} tokenList - liste de jetons à explorer
 */

    export class Explorer{

        constructor(tokenList){

            this.i = 0

            this.list = tokenList || []
            this.uuid = this.list.uuid
            this.source = this.list

            this.output = this.list

        }

        // fonction executée sur chaque jeton
        main(){}

        /**
         * Représente la boucle principale
         * @param {boolean} condition - la condition TantQue
         * @param {function} action - la fonction a executer TantQue la condition est vraie
         */
        while(condition, action){

            let tokenList = this.list

            for(this.i; this.i<tokenList.length; this.i++){

                let i = this.i

                if(!condition(tokenList[i], i)) break;
                action(tokenList[i], i)

            }

        }

        // mise en route de la boucle
        run(trace){

            if(trace) this.trace.startFrom(trace)

            this.while(

                // jusqu'à la fin de la liste
                ()=>{return true},

                // faire ...
                (token, option)=>{

                    // si on doit explorer les enfant du jeton
                    if(token.deep){

                        // on récupère le constructeur courant et on l'applique sur les enfants
                        // token.childs devient la nouvelle this.list
                        token.childs = new this.constructor(token.childs).run().output

                    }

                    // on applique la fonction main
                    this.main(token, option)

                }

            )

            return this

        }

        /**
         * Revoie l'élément suivant
         * @param {boolean} strict - si next peut générer des erreurs
         * @returns {Token}
         */
        next(strict = true){

            this.i++

            // On récupère le jeton courant et le jeton suivant
            let current = this.list[this.i-1]
            let next = this.list[this.i] || false

            // même principe que run
            if(next && next.deep) {
                next.childs = new this.constructor(next.childs).run().output
            }

            // si on gère l'affichage des erreurs
            else if(!strict && !next) {
                new Exception(current, 'EMPTY');
            }

            return next

        }

        before(n){
            return this.source[this.i-(n || 1)] || false
        }

        after(n){
            return this.source[this.i+(n || 1)] || false
        }

        length(n) {
            return this.source.length-(n || 1)
        }

        end(){
            return this.i === this.length()
        }

        closure(conditionWhile, token){
            
            if(conditionWhile && this.end()) {
                if(this.trace) token.trace.endBy(this.trace)
                new Exception(token, 'NO_CLOSURE')
            }

            return conditionWhile

        }

    }

//