import { Storage } from "../storage/Storage.js"

// [!] Si le chemin relatif remonte dans l'arborescence au delà de la racine les imports peuvent êtres doublés

export class PATH{

    /**
     * Prend un chemin relatif et le transforme en chemin relatif à la racine
     * @param {number} id - l'uuid du code source depuis lequel est appelé la méthode
     * @param {string} relativePath - le chemin relatif à alimenter
     * @returns - retourne le chemin relatif à la racine vers la ressource
     */

    static location(id, relativePath){

        let prefix = './'

        // Si le chemin est déjà un chemin absolu vers une ressource en http[s] alors on retourne le chemin
        if(PATH.isHTTP(relativePath)) return relativePath;

        // On obtient le chemin racine du document dans lequel est spécifié le chemin relatif 
        let root = Storage.path[id]

        // On retire le nom du fichier de l'url racine
        if(root) {

            // On regarde si la racine est en HTTP ou HTTPS
            let http = PATH.isHTTP(root)
            // Si oui on change le prefix des requêtes internes
            if(http) prefix = root.match(/^https?:\/\//)[0]

            // On purifie root du nom de fichier et de http
            root = root.split('/')
            if(http) root.shift()
            root.pop()
            root = root.join('/')
        }
        
        // console.log('[Location] root ->', root || './', 'relative ->', relativePath)

        // On génére l'url complete pour rendre le chemin relatif à la racine
        let full = root + '/' + relativePath;

        // On sépare les étapes dans l'url
        let folders = full.split('/')

        // On traite les opérateurs de destination
        for(let i = 0; i<folders.length; i++){

            // b = before, n = now
            let b = folders[i-1] || false
            let n = folders[i]

            // cas ou l'url commence par '/'
            // cas ou on trouve [path, ., path] nous donne path/path
            if(!n || n === '.'){
                folders.splice(i, 1)
                i--
            }

            // cas ou on trouve [path, .., path] nous donne path
            else if(n === '..' && b && b !== n){
                folders.splice(i-1, 2)
                i-=2
            }

        }

        // On transforme le tableau en chaine
        let path = prefix + folders.join('/')

        // console.log('[Location] final ->', path)

        // On retourne le chemin relatif à la racine
        return path

    }

    // Test si le chemin est une requête http[s] vers un serveur distant
    static isHTTP(path){
        return /^https?:\/\//.test(path)
    }

}