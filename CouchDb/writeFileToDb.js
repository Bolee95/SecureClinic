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

async function writeFileToDb(filepath) {

    const uidgen = new uidGenerator(128);

    const fileBuffer = fs.readFileSync(filepath);
    const fileBase64 = fileBuffer.toString('base64');
    const extension = path.extname(filepath);

    const body = {
        'file': fileBase64,
        'version': 1,
        'name': path.basename(filepath, extension),
        'extension': extension
    }

    // Should check if id is unique before writing to db
    //const uid = await md5(fileBase64);//uidgen.generate();
    const uid = await uidgen.generate();
    const requestUrl = protocol + username + ':' + pswrd + '@' + url + db + uid;
    console.log(requestUrl);

    request.put({
        url: requestUrl,
        body: { file: body },
        json:true,
    }, function(err,resp,body) {
        if (err == null) {
            console.log(body);
            return uid;
        }
    })
};

writeFileToDb(process.argv[2]);