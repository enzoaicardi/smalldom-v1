#! /usr/bin/env node

import { sdom } from '../lib/sdom.js'
import fs from 'fs'
import path from 'path'

// const fs = require('fs')
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

sdom.behavior('cli');
sdom.persistence(false);

/**
 * Commandes yargs
 */
    yargs(hideBin(process.argv))

        // Commande de compilation de fichier a fichier
        .command(

            'compile [source] [output]',

            'Compile a source file "sdom" into an output file "html|xml|..."',

            (yargs) => {
                yargs.positional('source', {
                    describe: 'The source.sdom file path',
                    type: 'string',
                    default: './index.sdom'
                }).positional('output', {
                    describe: 'The output.html file path',
                    type: 'string',
                    default: './'
                })
            },

            (argv) => { sdomCompile(argv) }
        )

        .option('watch', {
            alias: 'w',
            describe: 'Listen file changes for recompilation',
            type: 'boolean'
        })

        .option('layout', {
            alias: 'ly',
            describe: 'HTML layout on output [minified|preformatted]',
            type: 'string',
            default: 'minified'
        })

        .option('extension', {
            alias: 'ext',
            describe: 'The output file extension in case of output folder',
            type: 'string',
            default: 'html'
        })

        .help()
        .alias('help', 'h').argv

//
    
/**
 * Fonction de compilation
 * @param {string} sourceURL 
 * @param {string} outputURL 
 * @param {object} argv 
 */

    async function sdomCompile(argv){

        console.log('[COMPILATION] Launch...')
        
        let dir = process.cwd()
        let src = argv.source
        let out = argv.output
        
        let srcList = [src]
        
        // Si la source ne possède pas d'extension de fichier on considère qu'il s'agit d'un dossier
        if(!path.extname(src)){
            
            console.log('[COMPILATION] Your source is a directory...')
            dir = path.join(dir, src)
            
            // Si la sortie n'est pas un dossier on retourne une erreur
            if(path.extname(out)){
                console.log('[ERROR] Your output cannot be a file when your source is a directory')
                return
            }

            // Sinon on essaye d'ouvrir le dossier pour en extraire tout les noms de fichier
            try {
                srcList = fs.readdirSync(dir)
            } catch (err) {
                console.log('[ERROR] Cannot read directory : "', dir, '"')
                console.log(err)
                return
            }

        }

        // Pour chaque fichier
        srcList.forEach((file) => {

            // On vérifie qu'il porte la bonne extension .sdom .smalldom
            if(path.extname(file) !== '.sdom'
            && path.extname(file) !== '.smalldom') return;

            // On créer le chemin complet jusqu'au fichier
            file = path.join(dir, file)

            // Si c'est le cas on le compile
            console.log('[COMPILATION] Compiling "', file, '"...')

            // Si l'option watch est active
            if(argv.watch) {
                __watch(file, argv)
            }
            else {
                __compile(file, argv)
            }

        })

    }

    // Watch option
    async function __watch(file, argv){

        console.log('[WATCH] You are currently watching at file "', file, '"')
        console.log('[WATCH] Press CTRL+S to apply changes')

        fs.watchFile(file, {interval: 100}, () => {
            console.log('[WATCH] Recompile file "', file, '"')
            __compile(file, argv)
        });

    }

    // Fonction de compilation
    async function __compile(file, argv){

        let code;
        let out = path.join(process.cwd(), argv.output);
        let dir = path.extname(out) ? path.parse(out).dir : out;

        console.log('[COMPILATION] Get source code from "', file, '"...')

        // On récupère le code source du fichier
        try{
            code = fs.readFileSync(
                file,
                'utf8'
            );
        } catch (err) {
            console.log('[ERROR] Cannot read file : "', file, '"')
            console.log(err)
            return
        }

        try{
            // On créer le dossier de manière récursive s'il n'existe pas
            fs.mkdirSync(dir, {recursive: true})

        } catch (err) {
            console.log('[ERROR] Cannot create the following path : "', dir, '"')
            console.log(err)
            return
        }

        // Si la sortie est un dossier
        if(out === dir){
            // On recupère le nom du fichier d'entrée et on y ajoute la bonne extension
            let name = path.parse(file).name + '.' + (argv.extension || 'html')

            // On met a jour la sortie
            out = path.join(out, name)
        }

        console.log('[COMPILATION] Create output at "', out, '"...');
        
        // On lance la compilation du code source

        sdom.layout(argv.layout).transpile(code).then((xml)=>{

            try {

                // On créer le fichier de sortie
                fs.writeFileSync(
                    out,
                    xml
                );

            } catch (err) {
                console.log('[ERROR] Cannot create file : "', out, '"')
                throw err
            }

            console.log('[COMPILATION] Done !');

        }).catch(()=>{

            console.log('[ERROR] An error has occured during the compilation process, please read the logs above and try again.');

        })

    }

//