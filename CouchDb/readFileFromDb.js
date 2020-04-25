var request = require('request');
const fs = require('fs');
var protocol = 'http://';
var username = 'bogdan';
var pswrd = 'bogdan';
var url = '127.0.0.1:5984';
var db = '/db/';

async function readFileFromDb(fileId, extension) {
    console.log(fileId);
    const requestUrl = protocol + username + ':' + pswrd + '@' + url + db + fileId;
    console.log(requestUrl);
    request(requestUrl, function(err,res,body) {
        if (err == null) {
            console.log(body);
            const jsonResult = JSON.parse(body);
            const bufferedResult = Buffer.from(jsonResult['file'],'base64');
            fs.writeFileSync(fileId + '.' + extension, bufferedResult);
            console.log('File successfully written');
        }
        else {
            throw new Error(`Error while reading: ${err}`);
        }
    })
};

readFileFromDb(process.argv[2], process.argv[3]);