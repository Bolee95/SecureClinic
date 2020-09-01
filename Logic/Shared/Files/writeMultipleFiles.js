var uploadFile = require('../Files/writeFileToDbAPI');

async function uploadMultipleFiles(identityName, files) {

    var uids = [];
    var index = 0;
    var shouldReturn = false;
    for(let i = 0; i < 100; i++) {
        let file = files['file[' + index + ']'];
        if (file === undefined) {
            return uids;
        } else { 
            const result = await uploadFile(file);
            uids.push(result['id']);
            index++;
            if (shouldReturn) {
                return uids;
            }
        };
    }
}

module.exports = uploadMultipleFiles;