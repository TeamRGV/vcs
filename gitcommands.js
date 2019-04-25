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
    let manifestPath = dest + sourceFolderName + 'manifest.json';
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

    localRepoPath = localRepoPath + '/' + branchName + '/' + manifestFileName.split('manifest')[0];
    if (!fs.existsSync(localRepoPath))
        createManifestForCheckout(branchName, manifestFileName, localRepoPath)
    //if folder doesnot exists then update it and update entries in manifest
    else {
        console.log('branch name already exists')

    }


}

const mergeOut = (source, target) => {

    let grandmaManifest = findGrandma(source, target);

    console.log(grandmaManifest);
    let pathOfManifestFile = __dirname + '/repos/';
    let sourceFileManifestData = JSON.parse(fs.readFileSync(pathOfManifestFile + source));
    let targetFileManifestData = JSON.parse(fs.readFileSync(pathOfManifestFile + target));
    let grandmaManifestData = JSON.parse(fs.readFileSync(pathOfManifestFile + grandmaManifest))

    let sourcePathArray = sourceFileManifestData.sourceFolder.split('/');
    let sourceBrachName = sourcePathArray[sourcePathArray.length - 1];

    let grandMaPathArray = grandmaManifestData.sourceFolder.split('/');
    let grandMaBrachName = sourcePathArray[grandMaPathArray.length - 1];

    let targetFilesMap = new Map();
    let sourceFilesMap = new Map();
    let grandmaFileMap = new Map();

    targetFileManifestData.fileNames.forEach(targetFile => {
        targetFilesMap.set(targetFile.fileName, targetFile)

    });

    sourceFileManifestData.fileNames.forEach(sourceFile => {
        sourceFilesMap.set(sourceFile.fileName, sourceFile)
    })

    grandmaManifestData.fileNames.forEach(grandmaFile => {
        grandmaFileMap.set(grandmaFile.fileName, grandmaFile);
    })



    for (let sourceFileName of sourceFilesMap.keys()) {

        let targetFileData = targetFilesMap.get(sourceFileName);
        let sourceFileData = sourceFilesMap.get(sourceFileName);
        if (targetFilesMap.has(sourceFileName) && targetFileData.artifactId == sourceFileData.artifactId) {
            //file exists and artifact matches

            // targetFilesMap.delete(sourceFileName);

        } else if (targetFilesMap.has(sourceFileName)) {
            //file exists but artifact different
            let targetFolderName = targetFileManifestData.sourceFolder.split('/')
            let fileToRemove = targetFileManifestData.sourceFolder + '/' + targetFileData.relativePath.split(targetFolderName[targetFolderName.length - 1])[1];
            if (fs.existsSync(fileToRemove))
                fs.unlinkSync(fileToRemove);

            //create files

            let targetFilePath = fileToRemove.substr(0, fileToRemove.lastIndexOf('/') + 1);

            let targetFilePathMR = targetFilePath + sourceFileName.split('.')[0] + "_MR" + '.' + sourceFileName.split('.')[1];
            let targetFilePathMT = targetFilePath + sourceFileName.split('.')[0] + "_MT" + '.' + sourceFileName.split('.')[1];

            let fileContentsMR = fs.readFileSync(sourceFileData.relativePath + '/' + sourceFileData.artifactId, 'utf-8');
            let fileContentsMT = fs.readFileSync(targetFileData.relativePath + '/' + targetFileData.artifactId, 'utf-8');


            fs.writeFileSync(targetFilePathMR, fileContentsMR)
            fs.writeFileSync(targetFilePathMT, fileContentsMT)

            // targetFilesMap.delete(sourceFileName);
        } else {
            //file doesnt match

            // let sourceName = source.split('manifest')[0];
            let targetPath = targetFileManifestData.sourceFolder + sourceFileData.relativePath.split(sourceBrachName)[1];

            let fileContentsMR = fs.readFileSync(sourceFileData.relativePath + '/' + sourceFileData.artifactId, 'utf-8');
            console.log(targetPath)
            fs.writeFileSync(targetPath, fileContentsMR)
        }
    }

    for (let grandmaFileName of grandmaFileMap.keys()) {

        let targetFileData = targetFilesMap.get(grandmaFileName);
        let grandmaFileData = grandmaFileMap.get(grandmaFileName);
        if (targetFilesMap.has(grandmaFileName) && targetFileData.artifactId == grandmaFileData.artifactId) {
            //file exists and artifact matches

            // targetFilesMap.delete(sourceFileName);

        } else if (targetFilesMap.has(grandmaFileName)) {
            //file exists but artifact different
            let targetFolderName = targetFileManifestData.sourceFolder.split('/')
            let fileToRemove = targetFileManifestData.sourceFolder + '/' + targetFileData.relativePath.split(targetFolderName[targetFolderName.length - 1])[1];

            if (!sourceFilesMap.has(grandmaFileName)) {

                fs.unlinkSync(fileToRemove);
            }


            //create files

            let targetFilePath = fileToRemove.substr(0, fileToRemove.lastIndexOf('/') + 1);

            let targetFilePathMG = targetFilePath + grandmaFileName.split('.')[0] + "_MG" + '.' + grandmaFileName.split('.')[1];
            let targetFilePathMT = targetFilePath + grandmaFileName.split('.')[0] + "_MT" + '.' + grandmaFileName.split('.')[1];

            let fileContentsMG = fs.readFileSync(grandmaFileData.relativePath + '/' + grandmaFileData.artifactId, 'utf-8');
            let fileContentsMT = fs.readFileSync(targetFileData.relativePath + '/' + targetFileData.artifactId, 'utf-8');

            fs.writeFileSync(targetFilePathMG, fileContentsMG)
            fs.appendFileSync(targetFilePathMT, fileContentsMT)

            // targetFilesMap.delete(sourceFileName);
        } else {
            //file doesnt match
            //DO NOTHING SINCE FILE ALREADY IN TARGET

            // let grandmaName = grandmaManifest.split('manifest')[0];
            let targetPath = targetFileManifestData.sourceFolder + grandmaFileData.relativePath.split(grandMaBrachName)[1];

            let fileContentsMG = fs.readFileSync(grandmaFileData.relativePath + '/' + grandmaFileData.artifactId, 'utf-8');

            fs.writeFileSync(targetPath, fileContentsMG)

        }
    }





}

const checkIn = (sourcePath, isMergein) => {


    let dest = replaceBackSlash(__dirname + "/repos/");
    //get the source path and convert it to array to get the reponame
    let sourceArray = []
    let sourceFolderName;
    let sourceFolderNameManifest;
    let destDir;
    let manifestPath;
    if (sourcePath.includes('\\')) {
        sourceArray = sourcePath.split('\\');

        sourceFolderName = sourceArray[sourceArray.length - 1]
        sourceFolderNameManifest = sourceArray[sourceArray.length - 2];
        if (isMergein) {
            manifestPath = dest + sourceFolderName + 'manifestmergein' + Date.now() + '.json';
        } else {
            manifestPath = dest + sourceFolderNameManifest + 'manifestcheckin' + Date.now() + '.json';
        }

    } else {
        sourceArray = sourcePath.split('/');

        sourceFolderName = sourceArray[sourceArray.length - 1]
        sourceFolderNameManifest = sourceArray[sourceArray.length - 2];
        if (isMergein) {
            manifestPath = dest + sourceFolderName + 'manifestmergein' + Date.now() + '.json';
        } else {
            manifestPath = dest + sourceFolderNameManifest + 'manifestcheckin' + Date.now() + '.json';
        }
        // manifestPath = dest + sourceFolderName + 'manifestcheckin' + Date.now() + '.json';
    }
    destDir = dest + sourceFolderName;


    if (!fs.existsSync(destDir))
        fs.mkdir(destDir, (error) => {
            if (error) {

            } else {
                console.log('changes pushed to remote repository')
                if (isMergein) {
                    createManifest(destDir, sourceFolderName, sourcePath, manifestPath, 'mergein')
                } else {
                    createManifest(destDir, sourceFolderName, sourcePath, manifestPath, 'checkin')
                }

            }

        });
    //if folder doesnot exists then update it and update entries in manifest
    else {
        if (isMergein) {
            createManifest(destDir, sourceFolderName, sourcePath, manifestPath, 'mergein')
        } else {
            createManifest(destDir, sourceFolderName, sourcePath, manifestPath, 'checkin')
        }


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
        'sourceFolder': replaceBackSlash(sourcePath),
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
    let newManifestPath = replaceBackSlash(__dirname + "/repos/" + branchName + "manifestcheckout" + ".json");
    let manifestData = {
        'command': 'checkout',
        'destFolder': localRepoPath,
        'sourceFolder': oldManifestData.sourceFolder,
        'DataTime': Date.now(),
        'branchName': branchName,
        'manifestFileName': manifestFileName,
        'localRepoPath': localRepoPath,
        'fileNames': [],
        'labels': []
    };
    fs.writeFile(newManifestPath, JSON.stringify(manifestData), (err) => {
        if (err) {
            console.log(error);
        } else {
            //copy files to local repo
            // localRepoPath = localRepoPath + '/' + branchName;

            parseDirectoryForCheckOut(newManifestPath, localRepoPath, oldManifestData)
        }

    })
}

function findGrandma(sourceManifestName, targetManifestName) {

    // let manifestNames = readManifestNames();

    // let sourceCheckout = sourceManifestName.split('manifestcheckin')[0] + 'manifestcheckout.json';
    let targetManifestTree = [];

    getParentManifest(targetManifestName, targetManifestTree);
    console.log(targetManifestTree)
    let grandMa = getParentManifestOnlyCommon(sourceManifestName, targetManifestTree);

    return grandMa;


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

function getParentManifest(manifestFileName, targetManifests) {
    let remotePath = __dirname + '/repos/';
    let targetCheckout = manifestFileName.split('manifestcheckin')[0] + 'manifestcheckout.json';
    let targetCheckoutData = JSON.parse(fs.readFileSync(remotePath + targetCheckout));
    if (targetCheckoutData.manifestFileName.includes('manifest.json')) {
        targetManifests.push(targetCheckoutData.manifestFileName);
        return;
    }
    targetManifests.push(targetCheckoutData.manifestFileName);
    getParentManifest(targetCheckoutData.manifestFileName, targetManifests)
}

function getParentManifestOnlyCommon(manifestFileName, targetManifests) {
    let remotePath = __dirname + '/repos/';
    let targetCheckout = manifestFileName.split('manifestcheckin')[0] + 'manifestcheckout.json';
    let targetCheckoutData = JSON.parse(fs.readFileSync(remotePath + targetCheckout));

    console.log(targetCheckoutData.manifestFileName)

    if (targetCheckoutData.manifestFileName.includes('manifest.json') || targetManifests.includes(targetCheckoutData.manifestFileName)) {

        return targetCheckoutData.manifestFileName;
    }
    return getParentManifestOnlyCommon(targetCheckoutData.manifestFileName, targetManifests)

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

function readManifestNames() {
    let pathToRead = __dirname + '/repos';
    let files = fs.readdirSync(pathToRead);
    let manifestNames = []
    files.forEach(file => {
        if (file.includes(".")) manifestNames.push(file)
    })
    return manifestNames;


}

module.exports = {
    createRepo,
    label,
    checkOut,
    checkIn,
    mergeOut
}