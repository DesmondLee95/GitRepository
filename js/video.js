/*jslint devel: true*/
/*eslint-env browser*/
/* exported createComments */
/* exported emptyInput */

var config = {
    apiKey: "AIzaSyBM0e_dkZOgrC5v5kk1t1loGAj1GiFntyA",
    authDomain: "educational-video-learning-app.firebaseapp.com",
    databaseURL: "https://educational-video-learning-app.firebaseio.com",
    projectId: "educational-video-learning-app",
    storageBucket: "educational-video-learning-app.appspot.com",
    messagingSenderId: "1079981333838"
};
firebase.initializeApp(config);

//Initialize firestore
var db = firebase.firestore();

// Disable deprecated features for Firestore
db.settings({
    timestampsInSnapshots: true
});

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

getUserImage();
showRatedNumber();

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

//Get current user profile image to display in comment area
function getUserImage() {
    'use strict';

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userRef = db.collection("Users").doc(user.email);
            userRef.get().then(function (doc) {
                if (doc.exists) {
                    //Use user's profile picture if exists, or else, use the default picture.
                    if (doc.data().photoURL !== "") {
                        document.getElementById('userimg').src = doc.data().photoURL;
                    } else {
                        document.getElementById('userimg').src = "https://firebasestorage.googleapis.com/v0/b/educational-video-learning-app.appspot.com/o/profileImages%2Fdownload.jpg?alt=media&token=4a6a7e03-7fef-4abb-adf0-0c7e753235b7";
                    }
                }
            });
        }
    });
}

//Creates the comment structure and content when button is pressed.
function createComments() {
    'use strict';

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userRef = db.collection("Users").doc(user.email),
                videoRef = db.collection("Videos").doc("9CZrzrVZxs1dezOr6jAI"); //TODO

            videoRef.get().then(function (doc) {
                if (doc.exists) {

                    //Get current video's ID number to bind comment with video.
                    var vid_id = doc.id;

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
                            //Attributes for user profile image
                            if (userphoto === "") {
                                userImage.src = "";
                                userImage.setAttribute("height", "30");
                                userImage.setAttribute("width", "30");
                                userImage.setAttribute("alt", "Image");
                            } else {
                                userImage.src = userphoto;
                                userImage.setAttribute("height", "30");
                                userImage.setAttribute("width", "30");
                                userImage.setAttribute("alt", "Image");
                            }

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

                            //Store comment information into Firestore.
                            db.collection("Videos").doc("9CZrzrVZxs1dezOr6jAI").collection("comments").add({
                                comment_desc: userInput,
                                comment_user: userId, //TODO
                                comment_date: new Date()
                            });
                            document.getElementById("vid_comment").value = "";
                            document.getElementById('post').disabled = true;
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
db.collection("Videos").doc("9CZrzrVZxs1dezOr6jAI").collection("comments").orderBy("comment_date", "desc") //TODO
    .get()
    .then(function (querySnapshot) {
        'use strict';

        querySnapshot.forEach(function (doc) {

            var user_email = doc.data().comment_user,
                userComments = doc.data().comment_desc;


            db.collection("Users").doc(user_email).get().then(function (doc) {
                //Create structure for previous stored comments.
                var username = doc.data().Name,
                    userphoto = doc.data().photoURL,
                    bigDiv = document.createElement("div"),
                    ImgColDiv = document.createElement("div"),
                    TextColDiv = document.createElement("div"),
                    userRowDiv = document.createElement("div"),
                    userImage = document.createElement("img"),
                    TextColDivContent = document.createTextNode(userComments),
                    userRowDivContent = document.createTextNode(username),
                    cgroup = document.getElementById("commentGroup");
                //Attributes for user profile image
                userImage.src = userphoto;
                userImage.setAttribute("height", "30");
                userImage.setAttribute("width", "30");
                userImage.setAttribute("alt", "Image");

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

        });
    })
    .catch(function (error) {
        'use strict';

        console.log("Error getting documents: ", error);
    });


var videosRef = db.collection("Videos").doc("9CZrzrVZxs1dezOr6jAI"); //@TODO

//Display current video information
videosRef.get().then(function (doc) {
    'use strict';

    if (doc.exists) {
        //Format the timestamp taken from firestore and convert to date.
        var videoDate = new Date(doc.data().date_uploaded.toDate()),
            month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][videoDate.getMonth()],
            uploadDate = month + ' ' + videoDate.getDate() + ', ' + videoDate.getFullYear(),
            //Store user email into users variable.
            users = doc.data().video_uploader,
            userRef = db.collection("Users").doc(users),
            //Store video ID into vid_info variable.
            vid_info = document.getElementById("videolink");

        //Count and display average rating.
        db.collection("Videos").doc("9CZrzrVZxs1dezOr6jAI").collection("ratings").get().then(function (querySnapshot) { //TODO

            var allRating = [];
            querySnapshot.forEach(function (doc) {

                allRating.push(doc.data().rating);
            });

            //Get total of all rating in the array.
            function getSum(total, num) {
                return total + num;
            }
            //Calculation for average rating and stars.
            var fullRating = 5,
                //Calculate average rating by sum / number of elements in the array
                averageRating = allRating.reduce(getSum) / allRating.length,
                roundedAvgRating = Math.round(averageRating * 10) / 10,
                starsWidthRating = roundedAvgRating * 10 * 2 + '%';
            document.querySelector('.stars-inner').style.width = starsWidthRating;
            document.getElementById('vid_rating').innerHTML = roundedAvgRating;
        });

        //Get all necessary video information to display.
        document.getElementById('video_desc').innerHTML = doc.data().video_desc;
        document.getElementById('uploaded_date').innerHTML = uploadDate;
        document.getElementById('videolink').src = doc.data().video_link;
        document.getElementById('video_category').innerHTML = doc.data().video_category;
        document.getElementById('video_tag').innerHTML = doc.data().video_tags;
        document.getElementById('video_name').innerHTML = doc.data().video_name;
        document.getElementById('video_views').innerHTML = doc.data().video_views;

        //Get total duration of the displayed video.
        vid_info.addEventListener('durationchange', function () {
            var vidlength = vid_info.duration,
                vidplayed = vidlength * 80 / 100,
                x = doc.data().video_views;
            console.log(vidlength);
            console.log(vidplayed);

            //View + 1 when 80% of the video is played. (TODO)
            var getView = setInterval(function () {
                if (vid_info.readyState > 0) {
                    var playedLength = vid_info.played.start(0) + vid_info.played.end(0);
                    console.log(playedLength);

                    if (playedLength > vidplayed) {
                        clearInterval(getView);
                        x++;
                        db.collection("Videos").doc("9CZrzrVZxs1dezOr6jAI").update({
                            video_views: x
                        });
                    }
                }
            }, 3000);
        });


        //Get video uploader's name to display.
        userRef.get().then(function (doc) {

            document.getElementById('uploader').innerHTML = doc.data().Name;
        });
    } else {
        console.log("No such document!");
    }
}).catch(function (error) {
    'use strict';
    console.log("Error getting document:", error);
});

//TODO
function submitRating() {
    'use strict';
    var rated = document.getElementById("rates").value,
        ratedNum = Number(rated);


    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Videos").doc("9CZrzrVZxs1dezOr6jAI").collection("ratings").where("rated_user", "==", user.email) //TODO
                .get()
                .then(function (querySnapshot) {
                    //If rating document exist for a particular video, overwrite the previous rating, or else, create new rating document with the rated number.
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach(function (doc) {
                            db.collection("Videos").doc("9CZrzrVZxs1dezOr6jAI").collection("ratings").doc(doc.id).update({
                                rating: ratedNum
                            });
                        });
                    } else {
                        db.collection("Videos").doc("9CZrzrVZxs1dezOr6jAI").collection("ratings").add({
                            rated_user: user.email,
                            rating: ratedNum
                        });
                    }
                });
        } else {
            alert("You're not logged in!");
        }
    });
}


//TODO
function showRatedNumber() {
    'use strict';
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Videos").doc("9CZrzrVZxs1dezOr6jAI").collection("ratings").where("rated_user", "==", user.email)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        document.getElementById("rates").value = doc.data().rating;
                    });
                });
        }
    });


}
