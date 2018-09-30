/*jslint devel: true*/
/*eslint-env browser*/
/* exported uploadFile */

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

var selectedFile;
var selectedFileSize;
var progressBar = document.getElementById('upload_progress');
var filename = document.getElementById("upload_text");
var fileExtValidate = /(.*?)\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4|mkv|MKV|mov|MOV|3gp|3GP|webm|WEBM)$/;

document.getElementById("file").addEventListener('change', function (e) {
    'use strict';
    selectedFile = e.target.files[0];
    //Validate chosen file type
    if (fileExtValidate.test(selectedFile.name)) {
        //Validate chosen file size
        selectedFileSize = selectedFile.size / 1024 / 1024;
        if (selectedFileSize > 40) {
            alert("Chosen file exceeds 40MB!");
            selectedFile.value = null;
            document.getElementById("upload_text").innerHTML = "Choose a file to upload";
            document.getElementById("upload_text").style.color = "#808080";
            document.getElementById("upload_text").style.fontSize = "15px";
        } else {
            document.getElementById("upload_text").innerHTML = selectedFile.name;
            document.getElementById("upload_text").style.color = "#000000";
            document.getElementById("upload_text").style.fontSize = "18px";
        }
    } else {
        alert("Invalid file type!");
        selectedFile.value = null;
        document.getElementById("upload_text").innerHTML = "Choose a file to upload";
        document.getElementById("upload_text").style.color = "#808080";
        document.getElementById("upload_text").style.fontSize = "15px";
    }
});

function uploadFile() {
    'use strict';

    var video_name = document.getElementById('video_name').value,
        video_tag = document.getElementById('video_tag').value,
        video_category = document.getElementById('category').value,
        visibility = document.getElementById('visibility').value,
        video_desc = document.getElementById('video_desc').value,
        //Convert value to Boolean
        visibility_boolean = (visibility === "true"),
        filename = selectedFile.name,
        storageRef = firebase.storage().ref('userVideos/' + filename),
        upload = storageRef.put(selectedFile);

    //Video information validation
    if (video_name === "" || video_tag === "" || video_category === "" || video_desc === "" || selectedFile === null || selectedFile === "") {
        alert("Please fill in all details for your video file.");
    } else {
        //Validate video name length
        if (video_name.length > 32) {
            alert("Video name is too long.");
        }
        upload.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.value = percentage;
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        //Upload is paused
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        //Upload is running
                        break;
                }
            },
            function (error) {
                switch (error.code) {
                    case 'storage/unauthorized':
                        alert("Upload has failed! An error has happened.");
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        alert("Upload has been canceled.");
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        alert("Upload has failed! An error has happened.");
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            function complete() {
                upload.snapshot.ref.getDownloadURL().then(
                    function (downloadURL) {
                        firebase.auth().onAuthStateChanged(function (user) {
                            if (user) {
                                //Get logged-in username to store with the uploaded video
                                var docRef = db.collection("Users").doc(user.email);
                                //Write video information into Firestore when video is uploaded to Storage.
                                docRef.get().then(function (doc) {
                                    if (doc.exists) {
                                        var user;
                                        user = doc.data().Name;
                                        db.collection("Videos").add({
                                                video_link: downloadURL,
                                                video_uploader: user,
                                                video_category: video_category,
                                                video_tags: video_tag,
                                                video_desc: video_desc,
                                                date_uploaded: new Date(),
                                                video_visibility: visibility_boolean,
                                                video_rating: 0,
                                                video_name: video_name
                                            })
                                            .then(function () {
                                                //Clear form when video is successfully updated
                                                console.log("Document successfully written!");
                                                alert("Upload is successfully!");
                                                progressBar.value = "";
                                                selectedFile.value = null;
                                                document.getElementById("upload_text").innerHTML = "Choose a file to upload";
                                                document.getElementById("upload_text").style.color = "#808080";
                                                document.getElementById("upload_text").style.fontSize = "15px";
                                                document.getElementById('video_name').value = "";
                                                document.getElementById('video_tag').value = "";
                                                document.getElementById('category').value = "";
                                                document.getElementById('video_desc').value = "";
                                            })
                                            .catch(function (error) {
                                                console.error("Error writing document: ", error);
                                                alert("Upload has failed!");
                                            });

                                    } else {
                                        console.log("No such document!");
                                    }
                                });
                            } else {
                                alert("Please sign-in first!");
                                window.location = "index.html";
                            }
                        });
                    }
                );
            });
    }
}
