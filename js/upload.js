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
});

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
        function error(err) {

        },
        function complete() {
            var video_name = document.getElementById('video_name').value,
                video_tag = document.getElementById('video_tag').value,
                video_category = document.getElementById('category').value,
                visibility = document.getElementById('visibility').value,
                video_desc = document.getElementById('video_desc').value,
                visibility_boolean = (visibility === "true");



            upload.snapshot.ref.getDownloadURL().then(
                function (downloadURL) {
                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {
                            //Get logged-in username to store with the uplaoded video
                            var docRef = db.collection("Users").doc(user.email);
                            docRef.get().then(function (doc) {
                                if (doc.exists) {
                                    var user;
                                    user = doc.data().Name;
                                    db.collection("Videos").doc().set({
                                            video_link: downloadURL,
                                            video_uploader: user,
                                            video_category: video_category,
                                            video_tags: video_tag,
                                            video_desc: video_desc,
                                            date_uploaded: new Date(),
                                            video_visibility: visibility_boolean,
                                            video_rating: 0,
                                            video_name: video_name
                                        })
                                        .then(function () {
                                            console.log("Document successfully written!");
                                        })
                                        .catch(function (error) {
                                            console.error("Error writing document: ", error);
                                        });

                                } else {
                                    console.log("No such document!");
                                }
                            })

                        } else {

                        }
                    });
                });
        });
}
