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

async function writeFileToDb(data, filename, extension) {

    const uidgen = new uidGenerator(128);

    const fileBuffer = new Buffer(data);
    const fileBase64 = fileBuffer.toString('base64');
    const extension = path.extname(filepath);

    const body = {
        'file': fileBase64,
        'version': 1,
        'name': filename,
        'extension': extension
    }

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