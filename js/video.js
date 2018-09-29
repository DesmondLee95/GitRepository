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

//Disable post button if input is empty or starts with a SPACE
function emptyInput() {
    'use strict';

    var regex = /^[^\s].*/,
        commentcontent = document.getElementById("vid_comment").value;

    if (regex.test(commentcontent) && commentcontent !== "") {
        document.getElementById('post').disabled = false;
    } else {
        document.getElementById('post').disabled = true;
    }
}

//Creates the comment structure and content when button is pressed.
function createComments() {
    'use strict';

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userRef = db.collection("Users").doc(user.email),
                videoRef = db.collection("Videos").doc("L9TVrlFdpQHgrXgTWlVo"); //TODO

            videoRef.get().then(function (doc) {
                if (doc.exists) {

                    //Get current video's ID number to bind comment with video.
                    var vid_id = doc.id;
                    console.log(vid_id);

                    userRef.get().then(function (doc) {
                        if (doc.exists) {
                            var userInput = document.getElementById("vid_comment").value,
                                username = doc.data().Name,
                                userphoto = doc.data().photoURL,
                                userId = doc.id,

                                //Create structure for new comment
                                bigDiv = document.createElement("div"),
                                ImgColDiv = document.createElement("div"),
                                TextColDiv = document.createElement("div"),
                                userRowDiv = document.createElement("div"),
                                userImage = document.createElement("img"),
                                TextColDivContent = document.createTextNode(userInput),
                                userRowDivContent = document.createTextNode(username),
                                cgroup = document.getElementById("commentGroup");

                            // TODO
                            userImage.src = 'https://firebasestorage.googleapis.com/v0/b/educational-video-learning-app.appspot.com/o/profileImages%2Fdownload.jpg?alt=media&token=4a6a7e03-7fef-4abb-adf0-0c7e753235b7';
                            userImage.setAttribute("height", "30");
                            userImage.setAttribute("width", "30");
                            userImage.setAttribute("alt", "Image");
                            //var ImgColDivContent = doc.data()


                            bigDiv.className = 'row commentedBox';
                            ImgColDiv.className = 'col-md-1 col-sm-1 col-xs-2 imageBoxComment';
                            TextColDiv.className = 'col-md-11 col-sm-11 col-xs-10 commentArea';
                            userRowDiv.className = 'col-md-11 col-sm-11 col-xs-10 commentPoster';
                            bigDiv.appendChild(ImgColDiv);
                            bigDiv.appendChild(userRowDiv);
                            bigDiv.appendChild(TextColDiv);

                            ImgColDiv.appendChild(userImage);
                            userRowDiv.appendChild(userRowDivContent);
                            TextColDiv.appendChild(TextColDivContent);

                            cgroup.prepend(bigDiv);

                            //Store comment into Firestore.
                            db.collection("Comments").add({
                                comment_vid: vid_id,
                                comment_desc: userInput,
                                comment_user: userId, //TODO
                                comment_userPic: userphoto
                            });
                        }
                    });
                }
            });

        } else {
            alert("You're not logged-in!");
        }
    });
}

//Display out previous comments and append them by using for loop.
db.collection("Comments").where("comment_vid", "==", "L9TVrlFdpQHgrXgTWlVo") //TODO
    .get()
    .then(function (querySnapshot) {
        'use strict';

        querySnapshot.forEach(function (doc) {

            var userNames = doc.data().comment_user,
                userComments = doc.data().comment_desc,
                //Create structure for previous stored comments.
                bigDiv = document.createElement("div"),
                ImgColDiv = document.createElement("div"),
                TextColDiv = document.createElement("div"),
                userRowDiv = document.createElement("div"),
                userImage = document.createElement("img"),
                TextColDivContent = document.createTextNode(userComments),
                userRowDivContent = document.createTextNode(userNames),
                cgroup = document.getElementById("commentGroup");
            userImage.src = 'https://firebasestorage.googleapis.com/v0/b/educational-video-learning-app.appspot.com/o/profileImages%2Fdownload.jpg?alt=media&token=4a6a7e03-7fef-4abb-adf0-0c7e753235b7'; //@TODO
            userImage.setAttribute("height", "30");
            userImage.setAttribute("width", "30");
            userImage.setAttribute("alt", "Image");
            //var ImgColDivContent = doc.data()


            bigDiv.className = 'row commentedBox';
            ImgColDiv.className = 'col-md-1 col-sm-1 col-xs-2 imageBoxComment';
            TextColDiv.className = 'col-md-11 col-sm-11 col-xs-10 commentArea';
            userRowDiv.className = 'col-md-11 col-sm-11 col-xs-10 commentPoster';
            bigDiv.appendChild(ImgColDiv);
            bigDiv.appendChild(userRowDiv);
            bigDiv.appendChild(TextColDiv);

            ImgColDiv.appendChild(userImage);
            userRowDiv.appendChild(userRowDivContent);
            TextColDiv.appendChild(TextColDivContent);

            cgroup.append(bigDiv);
        });
    })
    .catch(function (error) {
        'use strict';

        console.log("Error getting documents: ", error);
    });

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
