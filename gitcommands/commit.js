var ncp = require('ncp').ncp;
const path = require('path');

ncp.limit = 16;

console.log(process.cwd());

process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});


let dest = __dirname + "/repos/";
console.log(process.argv[2]);

console.log(dest);
ncp(process.cwd(), dest, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('done!');
});