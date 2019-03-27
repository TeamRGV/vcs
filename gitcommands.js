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
        // createManifestIfExists(destDir, sourceFolderName, sourcePath, manifestPath)
    }




}

const checkOut = (manifestFileName, branchName, localRepoPath) => {

    let destinationBranchPath = replaceBackSlash(__dirname + "/repos/" + branchName);
    let localBranchPath = localRepoPath + '/' + branchName
    if (!fs.existsSync(localBranchPath))
        // fs.mkdir(localBranchPath, (error) => {
        //     if (error) {
        //         console.log(error)
        //     } else {
        //         console.log('branch created')

        //     }

        // });
        createManifestForCheckout(branchName, destinationBranchPath, manifestFileName, localRepoPath)
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

        // createManifestIfExists(destDir, sourceFolderName, sourcePath, manifestPath)
    }
}

const label = (manifestFileName, labelName, cwd) => {
    // let repoName = cwd;
    // for (let i = cwd.length - 1; i >= 0; i--) {
    //     if (repoName.charAt(i) === '/' || repoName.charAt(i) === '\\') {
    //         repoName = repoName.substring(i + 1, repoName.length );
    //         break;
    //     }
    // }
    let manifestPath = replaceBackSlash(__dirname + "/repos/" + manifestFileName);
    let manifestString = fs.readFileSync(manifestPath);
    let manifestData = JSON.parse(manifestString);


    manifestData.labels.push(labelName);

    fs.writeFileSync(manifestPath, JSON.stringify(manifestData))

}


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

//function to update manifest file 
function createManifestForCheckout(branchName, destinationBranchPath, manifestFileName, localRepoPath) {
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
            // ncp(oldManifestData.destFolder, localRepoPath, function (err) {
            //     if (err) {
            //         return console.error(err);
            //     }
            //     console.log('done!');
            // });
            parseDirectoryForCheckOut(oldManifestData.destFolder, destinationBranchPath, newManifestPath, localRepoPath, oldManifestData)
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
function parseDirectoryForCheckOut(sourceDir, destDir, manifestPath, localRepoPath, oldManifestData) {

    oldManifestData.fileNames.forEach((fileData) => {

        let localPath = fileData.relativePath.split('/repos/');
        let fileToBeCreated = localRepoPath;
        let filePathOnLocal = localPath[1].split('/');
        for (let i = 0; i < filePathOnLocal.length - 1; i++) {
            fileToBeCreated = fileToBeCreated + '/' + filePathOnLocal[i]
        }
        mkdirp(fileToBeCreated, function (err) {
            if (err) console.error(err)
            let artifactPath = fileData.relativePath + '/' + fileData.artifactId;
            console.log('Creating file ---->' + fileToBeCreated)
            let fileContents = fs.readFileSync(artifactPath, 'utf-8');
            fs.writeFileSync(fileToBeCreated + '/' + filePathOnLocal[filePathOnLocal.length - 1], fileContents)
        });



    })

    // let files = fs.readdirSync(sourceDir);
    // let tempDir = destDir;
    // let tempLocalDir = localRepoPath;
    // for (file in files) {
    //     let next = path.join(sourceDir, files[file]);
    //     //if (fs.lstatSync(next).checkDirectory() == true) {
    //     if (!checkDirectory(files[file])) {
    //         // destDir = tempDir + "/" + files[file];
    //         localRepoPath = tempLocalDir + "/" + files[file];
    //         fs.mkdirSync(localRepoPath);
    //         parseDirectoryForCheckOut(next, destDir, manifestPath, localRepoPath, oldManifestData);
    //     } else {
    //         let manifestString = fs.readFileSync(manifestPath);
    //         let manifestData = JSON.parse(manifestString);
    //         let localRepoPathArr = localRepoPath.split('/');
    //         let fileObject = {
    //             fileName: localRepoPathArr[localRepoPathArr.length - 1],
    //             relativePath: localRepoPath,
    //             artifactId: files[file]
    //         };
    //         manifestData.fileNames.push(fileObject);
    //         //create manifest
    //         fs.writeFileSync(manifestPath, JSON.stringify(manifestData))
    //         //fs.createReadStream(sourceDir).pipe(fs.createWriteStream());
    //         //fs.copyFile(sourceDir, destDir, (err) => {
    //         //    if (err) throw err;
    //         //});

    //         //create file
    //         // let fileData = fs.readFileSync(sourceDir + "/" + files[file]);
    //         // let newFilePathLocal = localRepoPath + '/' + files[file];
    //         // fs.writeFileSync(newFilePathLocal, fileData)





    //     }
    // }
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