import { Presets } from "../../core/storage/Presets.js"
import { Exception } from "../../core/tools/Exception.js"

/**
 * Parcours l'arbre DOM et génère le HTML / XML
 */

    export class Parser{

        constructor(tree, format = 'minified'){

            this.body = tree.body
            this.head = tree.head

            this.support = this.ruleData(tree.support)
            this.preset = tree.preset

            // Le code de sortie
            this.output = ''

            // Si on a un preset d'enregistré on l'utilise
            if(this.preset) this.body.childs = Presets[this.preset](this.body)

            // format [minified, preformatted, [breaks, spaces]]
            this.format;
            this.layout(format)

        }

        run(list = this.body.childs, level = 0){

            let output = ''

            for(let i=0; i < list.length; i++){

                let open = '', close = '', attr = ''
                let element = list[i]
                let hasChilds = element.childs.length

                // Si l'élément n'est pas un groupe
                if(element.type !== 'group'){

                    // Si l'élément est un en-tête HTML on y pousse les éléments de @head
                    if(element.type === 'element'
                    && element.value === 'head') {

                        element.childs.push(...this.head)
                    }

                    /**
                     * Attributes
                     */

                        // On ajoute les classes s'il y en a
                        if(element.classList
                        && element.classList.length) element.attributes.class = element.classList.join(' ')
                        // On rend les attributs sous forme de texte
                        for(let key in element.attributes){
                            attr += ' ' + key + '="' + element.attributes[key] + '"' 
                        }

                    //

                    /**
                     * TAG creation
                     */

                        // On ajoute la partie open avec les id, classes et autres attributs
                        if(element.type === 'string') open = this.escapeHTML(element.value)

                        else if(element.xml) open = '<? ' + element.value + attr + ' ?>'

                        // Si l'élément est un élément classique
                        else if(element.type === 'element') {

                            // On ajoute le début de la balise ouvrante
                            open = '<' + element.value + attr

                            // On ajoute la fin de la balise ouvrante
                            // Si la balise est auto fermante et qu'on a le support XML on ajoute le />
                            // Exception si la balise est un schéma XML il ne doit pas fermer avec le />
                            open += (element.selfClosing 
                                  && this.support.xml
                                  && element.identifier !== 'schema') ? ' />' : '>'

                            // On ajoute la balise fermante
                            // Si la balise n'est pas auto-fermante
                            if(!element.selfClosing) close = '</' + element.value + '>'

                        }

                    //

                    /**
                     * TAG building
                     */

                        // Si on veut formatter le code
                        if(this.format){

                            open = this.format[1].repeat(level)
                                 + open
                                 + (hasChilds ? this.format[0] : '')

                            close = (hasChilds ? this.format[1].repeat(level) : '')
                                  + close
                                  + this.format[0]

                        }

                                      output += open
                        if(hasChilds) output += this.run(element.childs, level+1)
                                      output += close

                    //

                }

                // Si l'élément est un conteneur on ajoute simplement le code des enfants
                else if(hasChilds){
                    output += this.run(element.childs, level)
                }

            }

            // On retourne la balise
            return output

        }

        // Récupère les différentes données d'une règle et renvoie un objet
        ruleData(list){
            
            let data = {}

            for(let element of list){

                // Si l'element est de type string on ajoute la clé à data
                if(element.type === 'string') data[element.value] = true

                // Si l'élément est un groupe on analyse les enfants du groupe
                // Seul le dernier groupe fait foi dans une ruleData, data se retrouvera écrasée dans ce cas
                else if(element.type === 'group') data = this.ruleData(element.childs)

                // Si le type n'est pas autorisé on renvoie une erreur
                else new Exception(element, 'BAD_TYPE')

            }

            return data

        }

        // Permet de choisir un format pour l'affichage des données
        layout(format){

            if(format === 'minified') this.format = false

            else if(format === 'preformatted') this.format = ['\n\n', '    ']

            else {

                if(typeof format === 'string'){
                    this.format = format.split('/')
                    this.format[0] = '\n'.repeat(Number(this.format[0]))
                    this.format[1] = ' '.repeat(Number(this.format[1]))
                }

                else this.format = format

            }

        }

        escapeHTML(code){
            return code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        }

    }

//