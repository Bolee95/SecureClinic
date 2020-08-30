var uploadFile = require('../Files/writeFileToDbAPI');
async function uploadMultipleFiles(identityName, files) {

    var uids = [];
    var index = 0;
    while(true) {
        let file = files['file[' + index + ']'];
        if (file === undefined) {
            break;
        } else {
            let uid = await uploadFile(file);

            if (uid !== null) {
                uids.push(uid);
                index++;
            } else {
                throw new Error(`File with name ${file.name} wasn\'t uploaded. Terminated.`);
            }
        }
    }
}

module.exports = uploadMultipleFiles;