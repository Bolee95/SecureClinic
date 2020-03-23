var request = require('request');
const fs = require('fs');
var protocol = 'http://';
var url = '127.0.0.1:5984';
var db = '/db/';
var uidGenerator = require('uid-generator');

async function writeFileToDb(filepath) {

    const uidgen = new uidGenerator(128);

    console.log(filepath);
    const fileBuffer = fs.readFileSync(filepath);
    const fileBase64 = fileBuffer.toString('base64');
    // Should check if id is unique before writing to db
    const uid = await uidgen.generate();
    request.put({
        url: protocol + url + db + uid,
        body: { file: fileBase64 },
        json:true,
    }, function(err,resp,body) {
        if (err == null) {
            console.log(body);
            return uid;
        }
    })
};

writeFileToDb(process.argv[2]);