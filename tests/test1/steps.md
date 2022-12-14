
# Etapes du transpilateur

## 1 - Lexer

On commence par donner le code au Lexer, qui va transformer ce code en un tableau de petits éléments qu'on appellera "items", ces éléments ont tous un type (word, delimiter), un nom, et un status. Cela permet de reconnaitre leur rôle dans la syntaxe.

## 2 - Borders

On donne ensuite le tableau obtenu au Borders (nom arbitraire) qui va analyser tous les items de type "border", c'est à dire tout les items définis par deux bordures comme des apostrophes, qui contiennent des règles internes uniques, et qui ne doivent donc pas être altérés par les règles externes.

## 3 - Delimiters

On transmet ensuite le tableau au Delimiters qui va transformer les items délimités par des bornes (open / close) en blocks contenant les elements internes sous forme d'enfants.

## 4 - Joins

Le Joins va ensuite repérer les élements qui doivent fusionner (comme par exemple un déclarateur de classe "." et le nom de la classe "my-class") afin de les réduire à un seul item et de repérer les erreurs.