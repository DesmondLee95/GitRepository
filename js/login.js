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

function login() {
    'use strict';

    var userEmail = document.getElementById("email_field").value,
        userPass = document.getElementById("password_field").value,
        auth = firebase.auth();

    auth.signInWithEmailAndPassword(userEmail, userPass)
        .then(function (user) {
            auth.onAuthStateChanged(function (user) {
                //Check if user is verified before allowing login
                if (user.emailVerified) {
                    // User is signed in.
                    window.location = "index.html";
                } else {
                    //User not signed in.
                    alert("Please verify your email before logging in.");
                }
            });
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            window.alert("Error: " + errorMessage);
            // ...
            document.getElementById('email_field').value = "";
            document.getElementById('password_field').value = "";
            document.getElementById('email_field').focus();
        });
}

function resetPass() {
    'use strict';

    var auth = firebase.auth(),
        emailAddress = document.getElementById("user_mail").value;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        // Email sent.
        alert("A reset password email has been sent to your email");
        window.location = "login.html";
    }).catch(function (error) {
        // An error happened.
        console.log("Email has not been sent.");
        alert("This email address does not exist.");
        document.getElementById('user_mail').value = "";
        document.getElementById('user_mail').focus();
    });
};
