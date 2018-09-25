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

/* var messaging = firebase.messaging();
messaging.requestPermission()
.then(function() {
    return messaging.getToken();
})
.then(function(token) {
    console.log(token);
})
.catch(function(err) {
    console.log('Error Occured.');
}) */


//Initialize firestore
var db = firebase.firestore();

// Disable deprecated features for Firestore
db.settings({
    timestampsInSnapshots: true
});

function logOut() {
    'use strict';
    var auth = firebase.auth();

    auth.signOut().then(function () {
        // Sign-out successful.
        alert("You've logged out.");
        window.location = "login.html";
    }).catch(function (error) {
        // An error happened.
        console.log("User not logged out.");
    });

}
