var request = require('request');
var path = require('path');
const fs = require('fs');
var md5 = require('md5');
var protocol = 'http://';
var username = 'admin';
var pswrd = 'admin';
var url = '127.0.0.1:5984';
var db = '/db/';
var uidGenerator = require('uid-generator');

async function writeFileToDb(file) {

    const uidgen = new uidGenerator(128);

    const fileData = fs.readFileSync(file.path);
    const fileBuffer = Buffer.from(fileData);
    const fileBase64 = fileBuffer.toString('base64');
    const filename = file.name;
    const extension = path.extname(filename);

    const body = {
        'file': fileBase64,
        'version': 1,
        'name': filename,
        'extension': extension
    }

    const uid = await uidgen.generate();

    const requestUrl = protocol + username + ':' + pswrd + '@' + url + db + uid;

    request.put({
        url: requestUrl,
        body: { file: body },
        json: true,
    }, function(err, resp, body) {
        if (err == null) {
            return uid;
        } else {
            return null;
        }
    })
};

module.exports = writeFileToDb;