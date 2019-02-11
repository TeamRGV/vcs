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


/*    
let filename = "file.txt";
getArtifactId(filename);

function getArtifactId(filename) {
    fs.readFile(filename, 'utf8', function (err, contents) {
        let extension = filename.split(".");
        let len = contents.length;
        let weights = [1, 7, 3, 7, 11];
        let checkSum = 0;
        let j = 0;
        for (let i = 0; i < len; i++) {
            j = j % weights.length;
            checkSum += weights[j++] * contents.charCodeAt(i);
        }
        let modulus = Math.pow(2, 31) - 1;
        checkSum = checkSum % modulus;
        let ID = `${checkSum}-L${len}.${extension[1]}`;
        console.log(ID);
    });
}

*/