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


function createComments() {
    /* firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //Get logged-in username to store with the uploaded video
            var userRef = db.collection("Users").doc(user.email);
            var videoRef = db.collection("Videos").doc("");

            userRef.get().then(function (doc) {
                if (doc.exists) {
                    var userImage;
                    user = doc.data().photoURL;
                    db.collection("Comments").doc().set({
                            comment_content = userInput,
                            comment_uid = user.uid,
                            comment_vid =

                        })
                        .then(function () {
                            //Clear form when video is successfully updated
                        })
                        .catch(function (error) {
                            console.error("Error writing document: ", error);
                        });
                } else {
                    console.log("No such document!");
                }
            });
        } else {
            alert("Please sign-in first!");
        }
    }); */

    var userInput = document.getElementById("vid_comment").value;

    var bigDiv = document.createElement("div");
    var ImgColDiv = document.createElement("div");
    var TextColDiv = document.createElement("div");
    var userImage = document.createElement("img");
    userImage.src = 'https://firebasestorage.googleapis.com/v0/b/educational-video-learning-app.appspot.com/o/profileImages%2Fdownload.jpg?alt=media&token=4a6a7e03-7fef-4abb-adf0-0c7e753235b7';
    userImage.setAttribute("height", "30");
    userImage.setAttribute("width", "30");
    userImage.setAttribute("alt", "Image");
    //var ImgColDivContent = doc.data()
    var TextColDivContent = document.createTextNode(userInput);
    var cgroup = document.getElementById("commentGroup");

    bigDiv.className = 'row commentedBox';
    ImgColDiv.className = 'col-md-1 col-sm-1 imageBoxComment';
    TextColDiv.className = 'col-md-11 col-sm-11 commentArea';
    bigDiv.appendChild(ImgColDiv);
    bigDiv.appendChild(TextColDiv);

    ImgColDiv.appendChild(userImage);
    TextColDiv.appendChild(TextColDivContent);

    cgroup.appendChild(bigDiv);
}

var videosRef = db.collection("Videos").doc(""); //@TODO

videosRef.get().then(function (doc) {
    'use strict';

    if (doc.exists) {
        var videoDate = new Date(doc.data().date_uploaded.toDate()),
            month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][videoDate.getMonth()],
            uploadDate = month + ' ' + videoDate.getDate() + ', ' + videoDate.getFullYear();

        console.log(doc.data());

        document.getElementById('video_name').innerHTML = doc.data().video_name;
        document.getElementById('video_rating').innerHTML = doc.data().video_rating;
        document.getElementById('uploader').innerHTML = doc.data().video_uploader;
        document.getElementById('video_desc').innerHTML = doc.data().video_desc;
        document.getElementById('uploaded_date').innerHTML = uploadDate;
        document.getElementById('videolink').src = doc.data().video_link;
        document.getElementById('video_category').innerHTML = doc.data().video_category;
    } else {
        console.log("No such document!");
    }
}).catch(function (error) {
    'use strict';
    console.log("Error getting document:", error);
});
