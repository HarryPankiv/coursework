import firebase from 'firebase'

var config = {
	apiKey: "AIzaSyAnKyt85Xgd_gWK7Q2vkWuc_PNIg8BmSPg",
	authDomain: "coursework-81769.firebaseapp.com",
	databaseURL: "https://coursework-81769.firebaseio.com",
	projectId: "coursework-81769",
	storageBucket: "coursework-81769.appspot.com",
	messagingSenderId: "467018230632"
};

var fire = firebase.initializeApp(config);

export default fire;