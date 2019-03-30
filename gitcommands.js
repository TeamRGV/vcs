let fs = require('fs');
let path = require('path')
var mkdirp = require('mkdirp');
// var ncp = require('ncp').ncp;

//implementation of the function createRepo
const createRepo = (sourcePath) => {

    let dest = replaceBackSlash(__dirname + "/repos/");

    sourcePath = replaceBackSlash(sourcePath)
    let sourceArray = sourcePath.split('/');


    //get the source path and convert it to array to get the reponame


    let sourceFolderName = sourceArray[sourceArray.length - 1]
    let destDir = dest + sourceFolderName;
    let manifestPath = dest + 'manifest' + sourceFolderName + '.json';
    //if folder doesnot exists then create it and make manifest
    if (!fs.existsSync(destDir))
        fs.mkdir(destDir, (error) => {
            if (error) {

            } else {
                console.log('changes pushed to remote repository')
                createManifest(destDir, sourceFolderName, sourcePath, manifestPath, 'createrepo')
            }

        });
    //if folder doesnot exists then update it and update entries in manifest
    else {
        console.log('cant merge to main branch as we dont have a merge function yet !!')

    }




}

const checkOut = (manifestFileName, branchName, localRepoPath) => {

    let localBranchPath = localRepoPath + '/' + branchName
    if (!fs.existsSync(localBranchPath))
        createManifestForCheckout(branchName, manifestFileName, localRepoPath)
    //if folder doesnot exists then update it and update entries in manifest
    else {
        console.log('branch name already exists')

    }


}

const checkIn = (sourcePath) => {

    let dest = replaceBackSlash(__dirname + "/repos/");
    //get the source path and convert it to array to get the reponame
    let sourceArray = []
    let sourceFolderName;
    let destDir;
    let manifestPath;
    if (sourcePath.includes('\\')) {
        sourceArray = sourcePath.split('\\');

        sourceFolderName = sourceArray[sourceArray.length - 1]

        manifestPath = dest + 'manifestcommit' + Date.now() + sourceFolderName + '.json';
    } else {
        sourceArray = sourcePath.split('/');

        sourceFolderName = sourceArray[sourceArray.length - 1]

        manifestPath = dest + 'manifestcommit' + Date.now() + sourceFolderName + '.json';
    }
    destDir = dest + sourceFolderName;


    if (!fs.existsSync(destDir))
        fs.mkdir(destDir, (error) => {
            if (error) {

            } else {
                console.log('changes pushed to remote repository')
                createManifest(destDir, sourceFolderName, sourcePath, manifestPath, 'checkin')
            }

        });
    //if folder doesnot exists then update it and update entries in manifest
    else {
        createManifest(destDir, sourceFolderName, sourcePath, manifestPath, 'checkin')


    }
}

//function for adding label to manifest file
const label = (manifestFileName, labelName, cwd) => {

    let manifestPath = replaceBackSlash(__dirname + "/repos/" + manifestFileName);
    let manifestString = fs.readFileSync(manifestPath);
    let manifestData = JSON.parse(manifestString);


    manifestData.labels.push(labelName);

    fs.writeFileSync(manifestPath, JSON.stringify(manifestData))

}

//function to create manifest file on createRepo
function createManifest(destDir, sourceFolderName, sourcePath, manifestPath, command) {

    let manifestData = {
        'command': command,
        'sourceFolder': sourceFolderName,
        'destFolder': destDir,
        'DataTime': Date.now(),
        'fileNames': [],
        'labels': []
    };


    fs.appendFile(manifestPath, JSON.stringify(manifestData), (error) => {
        if (error) {
            console.log(error);
        } else {
            parseDirectory(sourcePath, destDir, manifestPath)
        }
    })
}

//function to create manifest for checkout
function createManifestForCheckout(branchName, manifestFileName, localRepoPath) {
    let oldManifestPath = replaceBackSlash(__dirname + "/repos/" + manifestFileName);
    let oldManifestString = fs.readFileSync(oldManifestPath);
    let oldManifestData = JSON.parse(oldManifestString);
    let newManifestPath = replaceBackSlash(__dirname + "/repos/" + "manifestcheckout" + branchName + ".json");
    let manifestData = {
        'command': 'checkout',
        'sourceFolder': branchName,
        'destFolder': localRepoPath,
        'DataTime': Date.now(),
        'fileNames': [],
        'labels': []
    };
    fs.writeFile(newManifestPath, JSON.stringify(manifestData), (err) => {
        if (err) {
            console.log(error);
        } else {
            //copy files to local repo
            localRepoPath = localRepoPath + '/' + branchName;

            parseDirectoryForCheckOut(newManifestPath, localRepoPath, oldManifestData)
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

function checkDirectory(file) {
    let regex = /(\d)*-L(\d)*\.(\b)*/;
    return regex.test(file);
}


// make subfolders recursively
function parseDirectoryForCheckOut(manifestPath, localRepoPath, oldManifestData) {

    oldManifestData.fileNames.forEach((fileData) => {

        let localPath = fileData.relativePath.split('/repos/');
        let fileToBeCreated = localRepoPath;
        let filePathOnLocal = localPath[1].split('/');
        for (let i = 1; i < filePathOnLocal.length - 1; i++) {
            fileToBeCreated = fileToBeCreated + '/' + filePathOnLocal[i]
        }
        mkdirp(fileToBeCreated, function (err) {
            if (err) console.error(err)
            let artifactPath = fileData.relativePath + '/' + fileData.artifactId;
            console.log('Creating file ---->' + fileToBeCreated)
            let fileContents = fs.readFileSync(artifactPath, 'utf-8');
            let relativePathForLocalFile = fileToBeCreated + '/' + filePathOnLocal[filePathOnLocal.length - 1];
            fs.writeFileSync(relativePathForLocalFile, fileContents)
            console.log(manifestPath);
            let manifestDataString = fs.readFileSync(manifestPath);
            let manifestData = JSON.parse(manifestDataString);
            console.log(manifestData);
            let manifestFileData = {
                fileName: filePathOnLocal[filePathOnLocal.length - 1],
                relativePath: relativePathForLocalFile,
                artifactId: fileData.artifactId
            }
            manifestData.fileNames.push(manifestFileData)
            fs.writeFileSync(manifestPath, JSON.stringify(manifestData));

        });



    })

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

                    manifestData.fileNames.push(fileObject);
                    console.log('File created ---> ' + fileObject.relativePath);

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

function replaceBackSlash(dirName) {
    let dest = dirName;
    pathArray = dest.split('\\');
    dest = "";
    pathArray.forEach((destElem) => {
        if (dest.length != 0)
            dest = dest + '/' + destElem;
        else
            dest += destElem;
    })
    return dest;
}

module.exports = {
    createRepo,
    label,
    checkOut,
    checkIn
}