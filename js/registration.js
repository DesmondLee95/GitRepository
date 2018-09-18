/*jslint devel: true*/
/*eslint-env browser*/

window.onload = function () {
    'use strict';
    
    var reg = document.getElementById('registration');
    
    if(reg) {
        reg.addEventListener('submit',submitForm)
    }

    function submitForm(e) {
        e.preventDefault();

        var umail = document.getElementById("usermail").value,
            upass = document.getElementById("userpass").value,
            cupass = document.getElementById("cuserpass").value,

            //Password Complexity Regex
            hasUpperCase = /[A-Z]/.test(upass),
            hasLowerCase = /[a-z]/.test(upass),
            hasNumbers = /\d/.test(upass),
            hasNonalphas = /\W/.test(upass);

        if (umail == "" || upass == "" || cupass == "") {
            alert("Please fill in all your details.");
            return false;
        } else if (upass != cupass) {
            alert("Password does not match.");
            return false;
        } else if (upass.length < 6 || hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 3) {
            alert("Password is too weak, please include a mix of upper and lowercase letters, numbers and no symbols.");
            return false;
        } else {
            var regex = /^.[^a-z]{4,11}[0-9]+\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,
                regex2 = /^[^0-9]{1,10}[a-z]+\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,
                user = firebase.auth().currentUser;

            if (regex.test(umail)) {
                if (umail.indexOf('@students.swinburne.edu.my', umail.length - '@students.swinburne.edu.my'.length) !== -1) {
                    firebase.auth()
                        .createUserWithEmailAndPassword(umail, upass)
                        .then(function (user) {
                            firebase.auth().onAuthStateChanged(function (user) {
                                if (user.emailVerified) {
                                    console.log("Verified");
                                } else {
                                    user.sendEmailVerification().then(function () {
                                        alert("You've successfully logged in, please verify your Email to login.");
                                        // Email sent.
                                        document.getElementById('registration').reset();
                                        window.location = 'login.html';
                                    }).catch(function (error) {
                                        // An error happened.
                                    });
                                }
                            });
                        }).catch(function (error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;

                            alert(errorMessage);
                        });
                } else {
                    alert('Email must be a valid Swinburne Sarawak Email.');
                }
            } else if (regex2.test(umail)) {
                if (umail.indexOf('@swinburne.edu.my', umail.length - '@swinburne.edu.my'.length) !== -1) {
                    firebase.auth()
                        .createUserWithEmailAndPassword(umail, upass)
                        .then(function (user) {
                            firebase.auth().onAuthStateChanged(function (user) {
                                if (user.emailVerified) {
                                    console.log("Verified");
                                } else {
                                    user.sendEmailVerification().then(function () {
                                        alert("You've successfully logged in, please verify your Email to login.");
                                        // Email sent.
                                        document.getElementById('registration').reset();
                                        window.location = 'login.html';
                                    }).catch(function (error) {
                                        // An error happened.
                                    });
                                }
                            });
                        }).catch(function (error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;

                            alert(errorMessage);
                        });
                } else {
                    alert('Email must be a valid Swinburne Sarawak Email.');
                }
            } else {
                alert('Not a valid e-mail address.');
            }
        }
    }
};
