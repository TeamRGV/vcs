
let fs = require('fs');
let path = require('path')
// var ncp = require('ncp').ncp;

//implementation of the function createRepo
const createRepo = (sourcePath) => {

    let dest = __dirname + "/repos/";
    //get the source path and convert it to array to get the reponame
    let sourceArray = sourcePath.split('\\');

    let sourceFolderName = sourceArray[sourceArray.length - 1]
    let destDir = dest + sourceFolderName;
    let manifestPath = dest + 'manifest' + sourceFolderName + '.json';
    //if folder doesnot exists then create it and make manifest
    if (!fs.existsSync(destDir))
        fs.mkdir(destDir, (error) => {
            if (error) {

            } else {
                console.log('changes pushed to remote repository')
                createManifest(destDir, sourceFolderName, sourcePath, manifestPath)
            }

        });
    //if folder doesnot exists then update it and update entries in manifest
    else {
        console.log('cant merge to main branch as we dont have a merge function yet !!')
        // createManifestIfExists(destDir, sourceFolderName, sourcePath, manifestPath)
    }




}

const checkOut = (manifestFileName, branchName) => {

    let destinationBranchPath = __dirname + "/repos/" + branchName;
    if (!fs.existsSync(destinationBranchPath))
        fs.mkdir(destinationBranchPath, (error) => {
            if (error) {
                console.log(error)
            } else {
                console.log('branch created')
                createManifestForCheckout(branchName, destinationBranchPath, manifestFileName)
            }

        });
    //if folder doesnot exists then update it and update entries in manifest
    else {
        console.log('branch name already exists')
        // createManifestIfExists(destDir, sourceFolderName, sourcePath, manifestPath)
    }
    // ncp(manifestData.destFolder, destination, function (err) {
    //     if (err) {
    //         return console.error(err);
    //     }
    //     console.log('branch created');
    // });

}
const label = (manifestFileName, labelName, cwd) => {
    // let repoName = cwd;
    // for (let i = cwd.length - 1; i >= 0; i--) {
    //     if (repoName.charAt(i) === '/' || repoName.charAt(i) === '\\') {
    //         repoName = repoName.substring(i + 1, repoName.length );
    //         break;
    //     }
    // }
    let manifestPath = __dirname + "/repos/" + manifestFileName;
    let manifestString = fs.readFileSync(manifestPath);
    let manifestData = JSON.parse(manifestString);


    manifestData.labels.push(labelName);

    fs.writeFileSync(manifestPath, JSON.stringify(manifestData))

}


function createManifest(destDir, sourceFolderName, sourcePath, manifestPath) {

    let manifestData = {
        'command': 'push',
        'sourceFolder': sourceFolderName,
        'destFolder': destDir,
        'DataTime': new Date(),
        'fileNames': [],
        'labels': []
    };


    fs.appendFile(manifestPath, JSON.stringify(manifestData), (err) => {
        if (err) {
            console.log(error);
        } else {
            parseDirectory(sourcePath, destDir, manifestPath)
        }
    })
}

//function to update manifest file 
function createManifestForCheckout(branchName, destinationBranchPath, manifestFileName) {
    let oldManifestPath = __dirname + "/repos/" + manifestFileName;
    let oldManifestString = fs.readFileSync(oldManifestPath);
    let oldManifestData = JSON.parse(oldManifestString);
    let newManifestPath = __dirname + "/repos/" + "manifest" + branchName + ".json";
    let manifestData = {
        'command': 'checkout',
        'sourceFolder': branchName,
        'destFolder': destinationBranchPath,
        'DataTime': new Date(),
        'fileNames': [],
        'labels': []
    };
    fs.writeFile(newManifestPath, JSON.stringify(manifestData), (err) => {
        if (err) {
            console.log(error);
        } else {
            parseDirectoryForCheckOut(oldManifestData.destFolder, destinationBranchPath, newManifestPath)
        }

    })
}

// make subfolders recursively
function parseDirectory(sourceDir, destDir, manifestPath) {

    let files = fs.readdirSync(sourceDir);
    let tempDir = destDir;
    for (file in files) {
        let next = path.join(sourceDir, files[file]);
        if (fs.lstatSync(next).isDirectory() == true) {
            destDir = tempDir + "/" + files[file];
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir);
            }
            parseDirectory(next, destDir, manifestPath);
        } else {
            //create folder with filename
            destDir = tempDir + "/" + files[file];
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir);
            }
            createFileWithArtifactId(next, files[file], destDir, manifestPath)

        }
    }
}


// make subfolders recursively
function parseDirectoryForCheckOut(sourceDir, destDir, manifestPath) {


    let files = fs.readdirSync(sourceDir);
    let tempDir = destDir;
    for (file in files) {
        let next = path.join(sourceDir, files[file]);
        if (fs.lstatSync(next).isDirectory() == true) {
            destDir = tempDir + "/" + files[file];
            fs.mkdirSync(destDir);
            parseDirectoryForCheckOut(next, destDir, manifestPath);
        } else {
            let manifestString = fs.readFileSync(manifestPath);
            let manifestData = JSON.parse(manifestString);
            let fileObject = {
                fileName: files[file],
                relativePath: destDir,
                artifactId: files[file]
            };
            manifestData.fileNames.push(fileObject);
            console.log(sourceDir + " ----- " + destDir + '/')
            // fs.createReadStream(sourceDir).pipe(fs.createWriteStream());
            // fs.copyFile(sourceDir, destDir, (err) => {
            //     if (err) throw err;
            // });
            // fs.writeFileSync(manifestPath, JSON.stringify(manifestData))
            // createFileWithArtifactId(next, files[file], destDir, manifestPath)

        }
    }
}

//create a folder with the filename and save file with artifact id name
function createFileWithArtifactId(sourcePath, fileName, destPath, manifestPath) {
    fs.readFile(sourcePath, 'utf8', function (err, contents) {
        if (err) {
            console.log(err)
        } else {
            let artifactId = calculateArtifactId(sourcePath, contents)
            fs.appendFile(destPath + "/" + artifactId, contents, (err) => {
                if (err)
                    console.log(err);
                else {
                    let manifestString = fs.readFileSync(manifestPath);
                    let manifestData = JSON.parse(manifestString);
                    let fileObject = {
                        fileName: fileName,
                        relativePath: destPath,
                        artifactId: artifactId
                    };
                    console.log(manifestData.fileNames);
                    manifestData.fileNames.push(fileObject);


                    fs.writeFileSync(manifestPath, JSON.stringify(manifestData))


                }
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
    createRepo,
    label,
    checkOut
}