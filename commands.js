#!/usr/bin/env node
const program = require('commander');

const {
    push
} = require("./gitcommands");

program
    .version('1.0.0')
    .description('Version Control System')

program
    .command('push')
    .alias('p')
    .description('push to the remote repository')
    .action(() => {
        push(process.cwd());
    })
program.parse(process.argv);