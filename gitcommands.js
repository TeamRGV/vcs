var ncp = require('ncp').ncp;
let fs = require('fs');
let path = require('path')

const push = (sourcePath) => {

    let dest = __dirname + "/repos/";
    let sourceArray = sourcePath.split('\\');
    let sourceFolderName = sourceArray[sourceArray.length - 1]
    let destDir = dest + sourceFolderName;
    if (!fs.existsSync(destDir))
        fs.mkdir(destDir);

    parseDirectory(sourcePath, destDir)

}

function parseDirectory(sourceDir, destDir) {

    let files = fs.readdirSync(sourceDir);
    let tempDir = destDir;
    for (file in files) {
        let next = path.join(sourceDir, files[file]);
        if (fs.lstatSync(next).isDirectory() == true) {
            destDir = tempDir + "/" + files[file];
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir);
            }
            parseDirectory(next, destDir);
        } else {
            //create folder with filename
            destDir = tempDir + "/" + files[file];
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir);
            }
            createFileWithArtifactId(next, files[file], destDir)

        }
    }
}

function createFileWithArtifactId(sourcePath, fileName, destPath) {

    fs.readFile(sourcePath, 'utf8', function (err, contents) {
        if (err) {
            console.log(err)
        } else {
            let artifactId = calculateArtifactId(sourcePath, contents)
            fs.appendFile(destPath + "/" + artifactId, contents, (err) => {
                if (err)
                    console.log(err);
            });
        }
    });

}

function calculateArtifactId(sourcePath, contents) {

    let extension = sourcePath.split(".");
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
    return `${checkSum}-L${len}.${extension[1]}`;
}

module.exports = {
    push
}