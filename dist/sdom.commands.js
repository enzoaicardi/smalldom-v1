#! /usr/bin/env node

import { sdom } from '../lib/sdom.js'
import fs from 'fs'
import path from 'path'

// const fs = require('fs')
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

sdom.behavior('cli');

// Commands
yargs(hideBin(process.argv))

    .command(

        'compile [source] [output] [layout]',

        'Compile a source file ".sdom" into an output file ".html"',

        (yargs) => {
            yargs.positional('source', {
                describe: 'The source.sdom file path',
                type: 'string',
                default: './index.sdom'
            }).positional('output', {
                describe: 'The output.html file path',
                type: 'string',
                default: './dist/index.html'
            }).positional('layout', {
                describe: 'HTML layout on output [minified|preformatted]',
                type: 'string',
                default: 'minified'
            })
        },

        (argv) => {

            console.log('Compiling...');

            let sourceURL = path.join(process.cwd(), argv.source);
            let outputURL = path.join(process.cwd(), argv.output);

            sdomCompile(sourceURL, outputURL, argv)

        }
    )

    .command(

        'html [source] [folder] [layout]',

        'Compile a source file ".sdom" into an output file ".html"',

        (yargs) => {
            yargs.positional('source', {
                describe: 'The source file name',
                type: 'string',
                default: 'index'
            }).positional('folder', {
                describe: 'The output folder',
                type: 'string',
                default: './'
            }).positional('layout', {
                describe: 'HTML layout on output [minified|preformatted]',
                type: 'string',
                default: 'minified'
            })
        },

        (argv) => {
            console.log('Compiling...');

            let sourceURL = path.join(process.cwd(), argv.source + '.sdom');
            let outputURL = path.join(process.cwd(), argv.folder, argv.source + '.html');

            sdomCompile(sourceURL, outputURL, argv)
        }
    )

    .option('watch', {
        alias: 'w',
        description: 'Listen file changes for recompilation',
        type: 'boolean'
    })

    .help()
    .alias('help', 'h').argv

    
// functions

async function sdomCompile(sourceURL, outputURL, argv){

    if(argv.watch){

        console.log('[watch] You are currently watching changes on file', sourceURL)

        fs.watchFile(sourceURL, {interval: 100}, () => {
            console.log('[watch] rebuild...')
            _compile()
        });

    }
    else{
        _compile()
    }

    async function _compile(){

        console.log('[source] <- fetch source code from', sourceURL);

        let sourceCode = fs.readFileSync(
            sourceURL,
            'utf8'
        );

        let outputCode = await sdom.layout(argv.layout).transpile(sourceCode);

        console.log('[output] <- create output at', outputURL);

        fs.writeFileSync(
            outputURL,
            outputCode
        );

        console.log('[output] -> success !');

    }

}