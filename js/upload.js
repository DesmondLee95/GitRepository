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

var progressBar = document.getElementById('upload_progress');
var uploadBtn = document.getElementById('upload_button');
var cancelBtn = document.getElementById('cancel_button');

firebase.auth().onAuthStateChanged(function (user) {
    'use strict';
    //Check if user is verified before allowing login
    if (user) {
        uploadBtn.addEventListener('change', function (e) {

            var file = e.target.files[0],
                storageRef = firebase.storage().ref('userVideos/' + (user.uid) + '/' + file.name),
                upload = storageRef.put(file);

            cancelBtn.addEventListener('cancelupload', function (e) {
                upload.cancel();
            })


            upload.on('state_changed',
                function progress(snapshot) {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progressBar.value = percentage;

                },
                function error(err) {

                },

                function complete() {

                },
            );
        });
    } else {

    }
});
