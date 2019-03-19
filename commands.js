#!/usr/bin/env node
//npm module for making command line app
const program = require('commander');

//import function from gitcommand file
const {
    createRepo,
    label,
    checkOut
} = require("./gitcommands");

//set version of your app
program
    .version('1.0.0')
    .description('Version Control System')

//set commands for app
//currently only one command implemented i.e createRepo
program
    .command('createrepo')
    .alias('c')
    .description('initiate a repo in remote directory' + '\n' + 'generate artifact ids' + '\n' + 'generate artifact ids')
    .action(() => {
        createRepo(process.cwd());
    }).on('--help', () => {

    })

program
    .command('label')
    .alias('l')
    .description('add label to manifest file')
    .action((manifestFileName, labelName) => {

        label(manifestFileName, labelName, process.cwd());
    }).on('--help', () => {

    })

program
    .command('checkout')
    .alias('co')
    .description('create your new branch')
    .action((manifestFileName, branchName) => {

        checkOut(manifestFileName, branchName);
    }).on('--help', () => {

    })
program.parse(process.argv);

