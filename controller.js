const express = require('express');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser')

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());



//wildcard url for fetching file structure at particular url
router.get('/repos(/*)?', (req, res) => {
    let pathToRead = __dirname + req.url;
    console.log(pathToRead);
    if (fs.lstatSync(pathToRead).isDirectory() == true) {
        fs.readdir(pathToRead, (err, files) => {

            res.render('index', { files: files });
        });
    } else {
        res.sendFile(pathToRead);
        // fs.readFile(pathToRead, 'utf8', function (err, contents) {
        //     res.json(contents)
        // })
    }

});


//CREATE NEW REPO
router.post("/create/repo", (req, res) => {
    let repoName = __dirname + "/repos/" + req.body.repoName;
    fs.mkdir(repoName, (err) => {
        if (err) res.sendStatus(500);
        res.sendStatus(200);

    });
});


//CREATE FOLDER OR FILE IN CURRENT PATH
router.post("/repos(/*)?", (req, res) => {
    if (req.body.fileName != null || req.body.fileName != null) {
        let path = __dirname + req.url + "/" + req.body.fileName;
        console.log(path);
        fs.appendFile(path, req.body.fileData, (err) => {
            if (err) res.sendStatus(500);
            else res.sendStatus(200);
        })
    } else if (req.body.folderName != null || req.body.folderName != null) {
        let path = __dirname + req.url + "/" + req.body.folderName;
        console.log(path);
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) res.sendStatus(500);
            else res.sendStatus(200);
        });
    }

});



module.exports = router;  