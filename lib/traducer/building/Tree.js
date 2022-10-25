import { Token } from "../../core/objects/Token.js";
import { Presets } from "../../core/storage/Presets.js";
import { Exception } from "../../core/tools/Exception.js";

/**
 * Parcours le tableau de jeton et créer l'arbre DOM
 */

    export class Tree{

        constructor(tokenList){

            this.i = 0
            this.list = tokenList
            this.meta = this.list.meta

            this.head = []
            this.support = []
            this.preset = ''

            this.body =
            this.output = new Token(this.meta).set({type: 'body'})

            this.body.trace.start.col = -1

        }

        run(parent = this.body){

            // On ajoute l'opérateur de parenté forcée
            // Il est par défaut sur 'brother' lorsque l'on rencontre un groupe
            let force = parent.type === 'group' ? 'brother' : false

            for(this.i; this.i < this.list.length; this.i++){

                // On récupère le jeton courant
                let token = this.list[this.i]

                /**
                 * Pre-analyse des jetons et modification préalable
                 */

                    // Si le jeton est un conteneur de groupage
                    if(token.type === 'container'
                    && token.identifier === 'group'){
                        
                        // On créer un nouveau corps
                        // On l'alimente des enfants du conteneur
                        this.list[this.i] =
                        token = 
                        
                        new Tree(token.childs).run().body.set({
                            type: 'group',
                            trace: token.trace,
                            count: token.count
                        })

                        // Un conteneur doit être un enfant sauf si on a forcé un autre lien
                        if(!force) force = 'child'

                    }

                    // On change les primitifs words en elements pour la lisibilité
                    else if(token.type === 'word') token.type = 'element'

                //

                /**
                 * Ajout des elements
                 */

                    // Si le jeton est un élément
                    if(token.type === 'element'
                    || token.type === 'group'
                    || token.type === 'string'){

                        /**
                         * Self closing checking
                         */

                            if(this.list[this.i+1]){

                                let next = this.list[this.i+1]

                                // Si on veut une balise auto-fermante
                                if(next.type === 'symbol'
                                && next.identifier === 'exclamation') token.selfClosing = true

                                // Si on veut une balise ?xml?
                                else if(next.type === 'symbol'
                                && next.identifier === 'question') {

                                    // Est automatiquement une balise auto-fermante
                                    token.selfClosing = true
                                    token.xml = true
                                }

                            }

                        //

                        /**
                         * Level checking
                         */

                            // Si le jeton à une place moins élevée dans la colonne
                            // Ou que l'on a décidé qu'il serait un élément frère on retourne au parent
                            if((this.levelOf(token) <= this.levelOf(parent) && force !== 'child')
                            || force === 'brother' || parent.selfClosing) return;

                        //

                        /**
                         * Element pushing
                         */

                            // Si on veut les enfants dans l'entête
                            if(force === 'head') this.head.push(token)

                            // Si on veut ajouter une fonctionnalité
                            else if(force === 'support') this.support.push(token)

                            // Si on veut choisir un preset
                            else if(force === 'preset' && token.type === 'string') {

                                this.preset = token.value
                                // Si le preset n'existe pas on renvoie une erreur
                                if(typeof Presets[this.preset] !== 'function') new Exception(token, 'NO_PRESET')

                            }

                            // Sinon on les pousse dans les enfants du parent courant
                            else {
                                // On pousse le jeton autant de fois que sa propriété count
                                for(let x = 0; x<token.count; x++){
                                    parent.childs.push(token)
                                }
                            }

                        //

                        /**
                         * Exploration from current token
                         */

                            // On incrémente pour passer à l'élément suivant avant la fin de la boucle
                            this.i++

                            // Si le jeton n'est pas un noeud texte ou qu'il n'est pas auto-fermant
                            if(token.type !== 'string'){

                                // On lance une analyse des éléments suivants en prenant le jeton comme parent référent
                                this.run(token)

                            }

                            // Lorsqu'on tombe sur un élément qui n'est pas un enfant on décrémente pour réanaliser le dernier element dans le nouveau contexte
                            this.i--

                            // On reset les opérateurs de parenté
                            force = false

                        //

                    }

                    // Si le jeton est un conteneur d'attributs
                    else if(token.type === 'container'
                    && token.identifier === 'attribute'){
                        
                        // On ajoute les attributs au parent
                        token.childs.forEach((t)=>{

                            // Si l'attribut est une pair clé=valeur
                            if(t.type === 'association'
                            && t.name === 'assignment'){
                                
                                parent.attributes[
                                    t.childs[0].value
                                ] = t.childs[1].value
                            }
                            
                            // Si on a simplement la clé on lui attribue la valeur true
                            else if(t.type === 'string'
                            || t.type === 'word'){

                                parent.attributes[t.value] = true
                            }
                            
                            // Sinon on renvoie une erreur
                            else if(t.type !== 'symbol'
                            || t.identifier !== 'brother'){
                                new Exception(token, 'BAD_VALUE')
                            }

                        })

                    }

                    // Si on veut ajouter un id
                    else if(token.type === 'id') parent.attributes.id = token.value

                    // Si on veut ajouter une classe
                    else if(token.type === 'class') parent.classList.push(token.value)

                    // Si on veut que l'élément suivant soit forcément un élément enfant
                    else if(token.type === 'symbol'
                    && token.identifier === 'parent') force = 'child'

                    // Si on veut que l'élément suivant soit forcément un élément frère
                    else if(token.type === 'symbol'
                    && token.identifier === 'brother') force = 'brother'

                    // Si on veut que l'élément suivant soit dans l'entête
                    else if(token.type === 'rule'
                    && token.value === 'head') force = 'head'

                    // Si on veut que l'élément suivant définisse un support de document
                    else if(token.type === 'rule'
                    && token.value === 'support') force = 'support'

                    // Si on veut que l'élément suivant définisse un preset de document
                    else if(token.type === 'rule'
                    && token.value === 'preset') force = 'preset'

                //

            }

            return this

        }

        levelOf(token){
            return token.trace.start.col
        }

    }