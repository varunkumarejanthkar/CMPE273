const Users = require('../models/FileDetails');

function uploadFileToS3(file, module, user_id) {
    let promise = new Promise((resolve, reject) => {
        const params = {
            Bucket: awsBucket + '/' + module + '/' + user_id,
            Key: file.originalname,
            ContentType: file.mimetype,
            Body: fs.createReadStream(file.path),
            ACL: awsPermission
        };

        s3.upload(params, function (s3Err, resp) {
            if (s3Err) {
                console.log(s3Err);
                deleteFile(file);
                reject(s3Err);
            } else {
                imageUrl = resp.Location;
                deleteFile(file);
                resolve(resp);
            }
        });
    });
    return promise;
};

  let handle_request = async(msg, callback) => { 
    let response = {};
    let err = {};
    try {
        // const fileDetails = await Users.findOne({
        //     user 
        // });
        callback(null, user);        
    } catch (error) {
        console.log(error);
        err.status = "INTERNAL_SERVER_ERROR";
        err.data = "INTERNAL_SERVER_ERROR";
        //console.log("Mongo INTERNAL_SERVER_ERROR");
        callback(null, "INTERNAL_SERVER_ERROR");
    }
};

exports.handle_request = handle_request;