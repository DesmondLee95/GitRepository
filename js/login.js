/*jslint devel: true*/
/*eslint-env browser*/

function login() {

    var userEmail = document.getElementById("email_field").value,
        userPass = document.getElementById("password_field").value,
        auth = firebase.auth();

    auth.signInWithEmailAndPassword(userEmail, userPass)
        .then(function (user) {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    alert("You've successfully logged in.");
                    window.location = "index.html";
                } else {
                    //User not signed in.
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

function logout() {
    var auth = firebase.auth();

    auth.signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });

}

function resetpass() {
    var auth = firebase.auth();
    var emailAddress = document.getElementById("user_mail").value;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        // Email sent.
        console.log("Email sent");
    }).catch(function (error) {
        // An error happened.
    });
};
