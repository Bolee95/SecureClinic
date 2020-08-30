var request = require('request');
const fs = require('fs');
var protocol = 'http://';
var username = 'admin';
var pswrd = 'admin';
var url = '127.0.0.1:5984';
var db = '/db/';

async function readFileFromDb(fileId) {

    const requestUrl = protocol + username + ':' + pswrd + '@' + url + db + fileId;
    console.log(requestUrl);
    request(requestUrl, function(err,res,body) {
        if (err == null) {
            const jsonResult = JSON.parse(body);
            const bufferedResult = Buffer.from(jsonResult['file']['file'],'base64');
            const filename = jsonResult['file']['name'];
            // const extension =  jsonResult['file']['extension'];
            // const version = jsonResult['file']['version'];
            console.log('File successfully read');
            fs.writeFileSync(filename, bufferedResult);
            return {'buffer': bufferedResult,'filename': filename};
        }
        else {
            throw new Error(`Error while reading file with id ${fileId}: ${err}`);
        }
    });
};

module.exports = readFileFromDb;