/*jslint devel: true*/
/*eslint-env browser*/

var config = {
    apiKey: "AIzaSyBM0e_dkZOgrC5v5kk1t1loGAj1GiFntyA",
    authDomain: "educational-video-learning-app.firebaseapp.com",
    databaseURL: "https://educational-video-learning-app.firebaseio.com",
    projectId: "educational-video-learning-app",
    storageBucket: "educational-video-learning-app.appspot.com",
    messagingSenderId: "1079981333838"
};
firebase.initializeApp(config);

var db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true
});

var selectedFile;
var progressBar = document.getElementById('upload_progress');

document.getElementById("file").addEventListener('change', function (e) {
    'use strict';
    selectedFile = e.target.files[0];
})

function uploadFile() {
    'use strict';

    var filename = selectedFile.name,
        storageRef = firebase.storage().ref('userVideos/' + filename),
        upload = storageRef.put(selectedFile);

    upload.on('state_changed',
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.value = percentage;
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        function (error) {

        },
        function () {
            upload.snapshot.ref.getDownloadURL().then(
                function (downloadURL) {
                    console.log('File available at', downloadURL);

                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {
                            db.collection("Videos").doc("GG").set({
                                    Link: downloadURL,
                                    UserID: user.uid,
                                    Category: "Jumbo",
                                    Description: "Annyeong",
                                    Date_Uploaded: new Date("December 23, 2018"),
                                    Visibility: true,
                                    Rating: 1,
                                    Name: "bye"
                                })
                                .then(function () {
                                    console.log("Document successfully written!");
                                })
                                .catch(function (error) {
                                    console.error("Error writing document: ", error);
                                });
                        } else {

                        }
                    });
                });
        });
}
