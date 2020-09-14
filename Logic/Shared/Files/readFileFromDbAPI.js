var request = require('request-promise');
var temp = require('tmp');
const fs = require('fs');
var protocol = 'http://';
var username = 'admin';
var pswrd = 'admin';
var url = '127.0.0.1:5984';
var db = '/db/';

async function readFileFromDb(fileId) {

    try {
        const requestUrl = protocol + username + ':' + pswrd + '@' + url + db + fileId;

        var filepath;
        let result = await request(requestUrl, function(err, res, body) {
            if (err == null) {
                const jsonResult = JSON.parse(body);
                if (jsonResult['file'] !== undefined) {
                    const bufferedResult = Buffer.from(jsonResult['file']['file'],'base64');
                    const filename = jsonResult['file']['name'];
                    const extension =  jsonResult['file']['extension'];
                    const mime = jsonResult['file']['mime'];
                    // const version = jsonResult['file']['version'];
                    console.log('File successfully read');
                    var tempFile = temp.fileSync({ prefix: filename, postfix: extension });
                    fs.writeFileSync(tempFile.name, bufferedResult);

                    filepath = { 'tempPath': tempFile.name, 'filename': filename, 'mime': mime};
                }
            }
            else {
                //throw new Error(`Error while reading file with id ${fileId}: ${err}`);

                return `Error while reading file with id ${fileId}`;
            }
        });
        return filepath;
    } catch(erorr) {
        return `Error while reading file with id ${fileId}`;
    }
};

module.exports = readFileFromDb;