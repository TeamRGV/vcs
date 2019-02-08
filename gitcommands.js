var ncp = require('ncp').ncp;

const push = (sourcePath) => {
    let dest = __dirname + "/repos/";
    ncp(sourcePath, dest, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('done!');
    });
}

module.exports = {
    push
}