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

            if(argv.watch){

                console.log('[watch] You are currently watching changes on file', sourceURL)

                fs.watchFile(sourceURL, {interval: 100}, () => {
                    console.log('[watch] rebuild...')
                    sdomCompile(sourceURL, outputURL, argv.layout)
                });

            }
            else{
                sdomCompile(sourceURL, outputURL, argv.layout)
            }

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

function sdomCompile(sourceURL, outputURL, layout){

    console.log('[source] <- fetch source code from', sourceURL);

    let sourceCode = fs.readFileSync(
        sourceURL,
        'utf8'
    );

    let outputCode = sdom.layout(layout).transpile(sourceCode);

    console.log('[output] <- create output at', outputURL);

    fs.writeFileSync(
        outputURL,
        outputCode
    );

    console.log('[output] -> success !');

}