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
showRated();

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
                videoRef = db.collection("Videos").doc("1brCa919Y2iS9NJSe05s"); //TODO

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
                            db.collection("Videos").doc("1brCa919Y2iS9NJSe05s").collection("comments").add({
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
db.collection("Videos").doc("1brCa919Y2iS9NJSe05s").collection("comments").orderBy("comment_date", "desc") //TODO
    .get()
    .then(function (querySnapshot) {
        'use strict';

        querySnapshot.forEach(function (doc) {

            var user_email = doc.data().comment_user,
                userComments = doc.data().comment_desc,
                userphoto,
                username;

            //To get the name/photo of the comment users
            function getName() {
                db.collection("Users").doc(user_email).get().then(function (doc) {
                    username = doc.data().Name;
                    userphoto = doc.data().photoURL;
                    var userRowDivContent = document.createTextNode(username);

                    //Attributes for user profile image
                    userImage.src = userphoto;
                    userImage.setAttribute("height", "30");
                    userImage.setAttribute("width", "30");
                    userImage.setAttribute("alt", "Image");

                    ImgColDiv.appendChild(userImage);
                    userRowDiv.appendChild(userRowDivContent);
                });

            }
            //Structure for the comment section
            var bigDiv = document.createElement("div"),
                ImgColDiv = document.createElement("div"),
                TextColDiv = document.createElement("div"),
                userRowDiv = document.createElement("div"),
                userImage = document.createElement("img"),
                TextColDivContent = document.createTextNode(userComments),
                cgroup = document.getElementById("commentGroup");

            //Classes name for the structure for css purpose
            bigDiv.className = 'row commentedBox';
            ImgColDiv.className = 'col-md-1 col-sm-1 col-xs-2 imageBoxComment';
            TextColDiv.className = 'col-md-11 col-sm-11 col-xs-10 commentArea';
            userRowDiv.className = 'col-md-11 col-sm-11 col-xs-10 commentPoster';

            bigDiv.appendChild(ImgColDiv);
            bigDiv.appendChild(userRowDiv);
            bigDiv.appendChild(TextColDiv);

            TextColDiv.appendChild(TextColDivContent);

            cgroup.append(bigDiv);

            getName();
        });
    })
    .catch(function (error) {
        'use strict';
        console.log("Error getting documents: ", error);
    });

var videosRef = db.collection("Videos").doc("1brCa919Y2iS9NJSe05s"); //@TODO

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
        db.collection("Videos").doc("1brCa919Y2iS9NJSe05s").collection("ratings").get().then(function (querySnapshot) { //TODO

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

        //Get video uploader's name to display.
        userRef.get().then(function (doc) {

            document.getElementById('uploader').innerHTML = doc.data().Name;
        });

        //Video view count
        var timeStarted = -1,
            timePlayed = 0,
            duration = 0;

        // If video metadata is loaded get duration
        if (vid_info.readyState > 0) {
            getDuration.call(vid_info);
        } else {
            //If metadata not loaded, use event to get it
            vid_info.addEventListener('loadedmetadata', getDuration);
        }

        // remember time user started the video
        function videoStartedPlaying() {
            timeStarted = new Date().getTime() / 1000;
        }

        //Will run when the video is skipped/paused/stopped
        function videoStoppedPlaying(event) {
            // Start time less then zero means stop event was fired vidout start event
            if (timeStarted > 0) {
                var playedFor = new Date().getTime() / 1000 - timeStarted;
                timeStarted = -1;
                // add the new ammount of seconds played
                timePlayed += playedFor;
            }
        }
        //Get the rounded total duration of the video
        function getDuration() {
            duration = vid_info.duration;
        }

        function increaseView() {
            var totalDuration = duration * 80 / 100,
                roundedtotalDuration = Math.round(totalDuration),
                roundedPlayedDuration = Math.round(timePlayed),
                x = doc.data().video_views;

            //Add a view if 80% of the total video is watched
            var getView = setInterval(function () {
                if (roundedPlayedDuration > roundedtotalDuration) {
                    clearInterval(getView);
                    x += 1;
                    db.collection("Videos").doc("1brCa919Y2iS9NJSe05s").update({
                        video_views: x
                    });
                }
            }, 3000);
        }

        vid_info.addEventListener("play", videoStartedPlaying);
        vid_info.addEventListener("playing", function () {
            videoStartedPlaying();
            increaseView();
        });
        vid_info.addEventListener("ended", function () {
            videoStoppedPlaying();
            increaseView();
        });
        vid_info.addEventListener("pause", function () {
            videoStoppedPlaying();
            increaseView();
        });

    } else {
        console.log("No such document!");
    }
}).catch(function (error) {
    'use strict';
    console.log("Error getting document:", error);
});


//Shows the previous rating given to a video to the individual user.
function showRated() {
    'use strict';
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("Videos").doc("1brCa919Y2iS9NJSe05s").collection("ratings").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {

                if (doc.data().rated_user === user.email) {
                    var selectedIndex = doc.data().rating,
                        stars = document.querySelectorAll('.star');

                    // Loop through each star, and add or remove the `.selected` class to toggle highlighting
                    stars.forEach(function (star, index) {
                        if (index < selectedIndex) {
                            // Selected star or before it
                            // Add highlighting
                            star.classList.add('selected');
                        } else {
                            // After selected star
                            // Remove highlight
                            star.classList.remove('selected');
                        }
                    });
                    document.getElementById('user_rated').innerHTML = "You've rated this video " + selectedIndex + " stars.";
                }
            });
        });
    });
}

// Listen for form submissions for rating
document.addEventListener('submit', function (event) {
    'use strict';
    //Only allow authenticated users to rate the video
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            // Only run our code on .rating forms
            if (!event.target.matches('.rating')) return;

            // Prevent form from submitting
            event.preventDefault();

            // Get the selected star
            var selected = document.activeElement;
            if (!selected) return;
            var selectedIndex = parseInt(selected.getAttribute('data-star'), 10),
                stars = Array.from(event.target.querySelectorAll('.star'));

            // Loop through each star, and add or remove the `.selected` class to toggle highlighting
            stars.forEach(function (star, index) {
                if (index < selectedIndex) {
                    // Selected star or before it
                    // Add highlighting
                    star.classList.add('selected');
                } else {
                    // After selected star
                    // Remove highlight
                    star.classList.remove('selected');
                }
            });

            // Remove aria-pressed from any previously selected star
            var previousRating = event.target.querySelector('.star[aria-pressed="true"]');
            if (previousRating) {
                previousRating.removeAttribute('aria-pressed');
            }

            // Add aria-pressed role to the selected button
            selected.setAttribute('aria-pressed', true);
            db.collection("Videos").doc("1brCa919Y2iS9NJSe05s").collection("ratings").where("rated_user", "==", user.email) //TODO
                .get()
                .then(function (querySnapshot) {
                    //If rating document exist for a particular video, overwrite the previous rating, or else, create new rating document with the rated number.
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach(function (doc) {
                            db.collection("Videos").doc("1brCa919Y2iS9NJSe05s").collection("ratings").doc(doc.id).update({
                                rating: selectedIndex
                            });
                            document.getElementById('user_rated').innerHTML = "You've rated this video " + selectedIndex + " stars.";
                            setTimeout(function () {
                                document.getElementById('closeModal').click();
                            }, 2000);
                        });
                    } else {
                        db.collection("Videos").doc("1brCa919Y2iS9NJSe05s").collection("ratings").add({
                            rated_user: user.email,
                            rating: selectedIndex
                        });
                        document.getElementById('user_rated').innerHTML = "You've rated this video " + selectedIndex + " stars.";
                        setTimeout(function () {
                            document.getElementById('closeModal').click();
                        }, 2000);
                    }
                });
        } else {
            alert("You're not logged in!");
            event.preventDefault();
            document.getElementById('closeModal').click();
        }
    });

}, false);
