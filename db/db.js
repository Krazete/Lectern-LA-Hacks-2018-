var admin = require('firebase-admin');
var config = require('../config.json');

function DB() {
    this.db = null;
}
// user: userid, email, hash, type
// class: userid, classid, classname, videoid
// note: userid, classid, note
// chat: classid, userid-arr, msg-arr
// video: videoid, userid, link

// Initialize the database
DB.prototype.init = function() {
    if (!this.db && admin.apps.length == 0) {
        var serviceAccount = require('../resources/lectern-key.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Database initialized");
    }
    this.db = admin.firestore();
}

DB.prototype.addUser = function(userid, email, hash, type) {
    return this.db.collection(config.usersCollection).add({
        userid: parseInt(userid),
        email: email,
        hash: hash,
        type: type
    });
}

DB.prototype.addClass = function(userid, classid, classname, vlink) {
    return this.db.collection(config.classCollection).add({
        userid: parseInt(userid),
        classid: parseInt(classid),
        classname: classname,
        vlink: vlink
    });
}

// DB.prototype.uploadVideo = function(file) {
//     console.log(typeof(type));
//     var metadata = { contentType: file.type };
//     // Upload file and metadata to a video object
//     var uploadTask = storageRef.child('video/' + file.name).put(file, metadata);

//     // Listen for state changes, errors, and completion of the upload.
//     uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
//         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log('Upload is ' + progress + '% done');
//         switch (snapshot.state) {
//         case firebase.storage.TaskState.PAUSED: // or 'paused'
//             console.log('Upload is paused');
//             break;
//         case firebase.storage.TaskState.RUNNING: // or 'running'
//             console.log('Upload is running');
//             break;
//         }
//     }, function(error) {

//     // A full list of error codes is available at
//     // https://firebase.google.com/docs/storage/web/handle-errors
//     switch (error.code) {
//         case 'storage/unauthorized':
//         // User doesn't have permission to access the object
//         break;

//         case 'storage/canceled':
//         // User canceled the upload
//         break;

//         case 'storage/unknown':
//         // Unknown error occurred, inspect error.serverResponse
//         break;
//     }
//     }, function() {
//     // Upload completed successfully, now we can get the download URL
//     var downloadURL = uploadTask.snapshot.downloadURL;
//     console.log(downloadURL);
//     });
// }

DB.prototype.addNote = function(email, classid, note) {
    return this.db.collection(config.noteCollection).add({
        email: email,
        classid: parseInt(classid),
        note: note
    });
}

DB.prototype.getDoc = function(collection, query1, query2) {
    var ref = this.db.collection(collection);
    if ((query1 == null) && (query2 == null)) {
        return ref.get();
    }
    else if (query2 == null) {
        var queryArr = query1.split(" ");
        let value = isNaN(queryArr[2]) ? queryArr[2] : parseInt(queryArr[2]);
        return ref.where(queryArr[0] , queryArr[1], value).get();
    }
    else {
        var queryArr1 = query1.split(" ");
        var queryArr2 = query2.split(" ");
        let value1 = isNaN(queryArr1[2]) ? queryArr1[2] : parseInt(queryArr1[2]);
        let value2 = isNaN(queryArr2[2]) ? queryArr2[2] : parseInt(queryArr2[2]);
        return ref.where(queryArr1[0] , queryArr1[1], value1).
                    where(queryArr2[0] , queryArr2[1], value2).
                    get();
    }
}

module.exports = DB;
