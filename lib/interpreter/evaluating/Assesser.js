import { Explorer } from "../../core/loops/Explorer.js";
import { Storage } from "../../core/storage/Storage.js";
import { Exception } from "../../core/tools/Exception.js";

/**
 * Parcours le tableau de jeton et évalue toutes les expressions
 */

export class Assesser extends Explorer{

    constructor(tokenList){
        super(tokenList)
    }

    main(token){


        // Si le jeton correspond à l'association de valeurs
        if(token.type === 'association'){
            
            this.assignation(token)
            this.operation(token)

        }


    }

    assignation(token){

        // Si le jeton ne correspond pas à l'assignation de valeurs alors on passe à la méthode suivante
        if(token.name !== 'assignment') return;

        let first = token.childs[0]
        let second = token.childs[1]

        // Si le premier enfant est une assignation de variable
        if(first.type === 'variable'
        && first.identifier === 'assignment'){

            // On met a jour la valeur de la variable
            Storage.variable[first.value] = second
            console.log(Storage.variable)

        }

        // Sinon on retourne simplement le deuxieme enfant
        else{
            this.output.splice(this.i, 1, second)
        }

    }

    operation(token){

        // ...
        if(token.name !== 'operator') return;

        let first = token.childs[0]
        let second = token.childs[1]

        // Si le second argument n'est pas un nombre, dans tous les autre cas qu'une addition on renvoie une erreur
        if(token.identifier !== 'add' && second.type !== 'number') new Exception(token, 'NaN')

        // Si les deux arguments sont des nombres alors on renvoie le résultat
        if(second.type === 'number'
        && first.type === 'number'){

            let a = Number(first.value)
            let b = Number(second.value)
            let result;

            // On calcule le résultat de l'opération
            if(token.identifier === 'add') result = a + b
            if(token.identifier === 'substract') result = a - b
            if(token.identifier === 'multiply') result = a * b
            if(token.identifier === 'divide') result = a / b
            if(token.identifier === 'modulo') result = a % b

            // On met a jour la valeur et la trace de pile
            first.value = result
            first.trace.endBy(second.trace)

            this.output.splice(this.i, 1, first)

        }

        // Si seul le second argument est un nombre dans le cas d'une addition ou d'une multiplication
        else if(second.type === 'number'
        && (token.identifier === 'add'
        || token.identifier === 'multiply')){

            first.count = first.count * Number(second.value)
            this.output.splice(this.i, 1, first)

        }

        // 

    }

}