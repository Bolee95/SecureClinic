var uploadFile = require('../Files/writeFileToDbAPI');
const { ResponseError } = require('../../../Logic/Response/Error');

async function uploadMultipleFiles(identityName, files) {
    try {
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
    } catch (error) {
        return ResponseError.createError(400, error);
    }
}

module.exports = uploadMultipleFiles;