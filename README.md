# smalldom / sdom

## What it is

sdom or "small dom" is a dynamic markup language for creating files based on XML or HTML.

## How does it works

### step n°1

First you create a .sdom file in which you write your markup as shown below.
For the exemple we gonna use the HTML document pattern.

```
html

    head {
        meta [charset="UTF-8"]
    }

    body {

        // Content here...

    }
```

### step n°2

In a second time you just need to run the following command to compile your code.

`sdom compile [source.sdom] [folder/output.html] [minified|preformatted] [--watch]`

Arguments :
- `[source.sdom]` the path to your source file (index.sdom by default)
- `[output.html]` the path to your output file (dist/index.html by default)
- `[minified]` the layout render of your html, you can custom it by using `[numberBreaks/numberSpaces]` notation (minified by default)
- `[--watch]` the option to recompile everytime your .sdom file change
- `[--help]` for help informations

> If you specify a folder be sure it exists !

### step n°3

Open your HTML file and you will see...

```
<html>

    <head>
        <meta charset="UTF-8">
    </head>

    <body>

        // Content here...

    </body>

</html>
```

### step n°4

Read the documentation to see all possibilities with sdom.
[https://sdom.aicardi.pro/doc](https://sdom.aicardi.pro/doc)

## Why should i use it ?

No particular reason :)