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

var videosRef = db.collection("Videos").doc(); //@TODO


videosRef.get().then(function (doc) {
    if (doc.exists) {
        var videoDate = new Date(doc.data().date_uploaded.toDate());
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][videoDate.getMonth()];
        var uploadDate = month + ' ' + videoDate.getDate() + ', ' + videoDate.getFullYear();
        console.log(videoDate);

        document.getElementById('video_name').innerHTML = doc.data().video_name;
        document.getElementById('video_rating').innerHTML = doc.data().video_rating;
        document.getElementById('uploader').innerHTML = doc.data().video_uploader;
        document.getElementById('video_desc').innerHTML = doc.data().video_desc;
        document.getElementById('uploaded_date').innerHTML = uploadDate;
        document.getElementById('video_category').innerHTML = doc.data().video_category;

    } else {
        console.log("No such document!");
    }
}).catch(function (error) {
    console.log("Error getting document:", error);
});
