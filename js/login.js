/*jslint devel: true*/
/*eslint-env browser*/

function login() {
    'use strict';

    var userEmail = document.getElementById("email_field").value,
        userPass = document.getElementById("password_field").value,
        auth = firebase.auth();

    auth.signInWithEmailAndPassword(userEmail, userPass)
        .then(function (user) {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user.emailVerified) {
                    // User is signed in.
                    alert("You've successfully logged in.");
                    window.location = "index.html";
                } else {
                    //User not signed in.
                    alert("Please verify your E-mail.");
                }
            });
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            window.alert("Error: " + errorMessage);
            // ...
        });
}

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

function resetPass() {
    'use strict';
    var auth = firebase.auth(),
        emailAddress = document.getElementById("user_mail").value;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        // Email sent.
        alert("E-mail has been sent to reset your password.");
    }).catch(function (error) {
        // An error happened.
        console.log("Email has not been sent.");
    });
};
