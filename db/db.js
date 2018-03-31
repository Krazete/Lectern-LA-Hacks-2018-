var admin = require('firebase-admin');
var config = require('../config.json');

function DB() {
    this.db = null;
}
// user: userid, email, hash, type
// class: userid, classid, classname, video-arr
// note: userid, classid, note
// chat: classid, userid-arr, msg-arr

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
        userid: userid,
        email: email,
        hash: hash,
        type: type
    });
}

DB.prototype.addClass = function(userid, classid, classname, vlink) {
    return this.db.collection(config.usersCollection).add({
        userid: userid,
        classid: classid,
        classname: classname,
        vlink: vlink
    });
}

DB.prototype.uploadVideo = function(file, type) {
    var metadata = { contentType: type };
    // Upload file and metadata to a video object
    var uploadTask = storageRef.child('video/' + file.name).put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
    }, function(error) {

    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
        case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

        case 'storage/canceled':
        // User canceled the upload
        break;

        case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
    }, function() {
    // Upload completed successfully, now we can get the download URL
    var downloadURL = uploadTask.snapshot.downloadURL;
    });
}

DB.prototype.addNote = function(email, classid, note) {
    return this.db.collection(config.noteCollection).add({
        email: email,
        classid: classid,
        note: note
    });
}

DB.prototype.getDoc = function(collection, query=null) {
    var ref = this.db.collection(collection);
    if (query != null) {
        var queryArr = query.split(" ");
        return ref.where(queryArr[0] , queryArr[1], queryArr[2]).get();
    }
    else {
        return ref.get();
    }
}

module.exports = DB;
