const testFolder = '/abcd/';
const fs = require('fs');
const path = require('path');

var createRepo = __dirname + '/repos' + testFolder;
if (!fs.existsSync(createRepo)) {
  fs.mkdirSync(createRepo);
}


function parseDirectory(dir, mainDir) {
  //console.log('[+]', dir);
  var files = fs.readdirSync(dir);
  let tempDir = mainDir;
  for (var x in files) {
    var next = path.join(dir, files[x]);
    if (fs.lstatSync(next).isDirectory() == true) {
      mainDir = tempDir + "/" + files[x];
      if (!fs.existsSync(mainDir)) {
        fs.mkdirSync(mainDir);
      }
      parseDirectory(next, mainDir);
    } else {
      mainDir = tempDir + "/" + files[x];
      if (!fs.existsSync(mainDir)) {
        fs.mkdirSync(mainDir);
      }

      let myVal = getArtifactId(next, files[x], mainDir)
      myVal.then((filename) => {
        //console.log(filename);

      })



    }
  }
}

parseDirectory(__dirname + testFolder, __dirname + '/repos' + testFolder);


function getArtifactId(filename, file, mainDir) {
  return new Promise((res, rej) => {
    fs.readFile(filename, 'utf8', function (err, contents) {
      if (err) {
        rej(err);
      } else {
        console.log("--------------" + file + "----------" + mainDir);
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
        res(ID)
        fs.writeFile(mainDir + "/" + ID, contents, (err) => {
          if (err)
            console.log(err);
        });
      }
    });
  }).then(res => {
    return res;
  })



}