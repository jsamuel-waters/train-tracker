// Initialize Firebase
var config = {
	apiKey: "AIzaSyBNS1PWoFqYDzRIxQnzC4Aw1K0kOqF1x5Q",
	authDomain: "train-tracker-d6328.firebaseapp.com",
	databaseURL: "https://train-tracker-d6328.firebaseio.com",
	projectId: "train-tracker-d6328",
	storageBucket: "train-tracker-d6328.appspot.com",
	messagingSenderId: "1058442895752"
};
firebase.initializeApp(config);

var database = firebase.database();



database.ref().on("child_added", (snapshot) => {
	if ((snapshot.child("name").exists()) && (snapshot.child("destination").exists())) {
		var tName = snapshot.val().name;
		var tFreq = moment().format(snapshot.val().frequency, "mm");
		var fTrain = moment().format(snapshot.val().fTrain, "hh:mm");
		var destination = snapshot.val().destination;


		var fTrainCon = moment(fTrain, "hh:mm").subtract(1, "years");
		console.log("tFreq: " + tFreq);
		console.log("fTrain: " + fTrainCon);

		
		var totalTime = moment().diff(moment(fTrainCon), "minutes");
		console.log("totalTime: " + totalTime);
		
		var timeTaken = totalTime % tFreq;
		console.log("timeTaken: " + timeTaken);
		
		var timeLeft = tFreq - timeTaken;
		console.log("timeLeft: " + timeLeft);
		
		var nTrain = moment().add(timeLeft, "minutes");
		console.log("nTrain: " + nTrain);

		var fTrainCon2 = fTrainCon.format("hh:mm a");
		var nTrainCon2 = nTrain.format("hh:mm a");

		var newRow = $("<tr>");
		var newName = $("<td>");
		var newFreq = $("<td>");
		var newTrain = $("<td>");
		var newDest = $("<td>");
		var tLeft = $("<td>");
		var nextTrain = $("<td>");

		newName.text(tName);
		newFreq.text(tFreq);
		newTrain.text(fTrainCon2);
		newDest.text(destination);
		tLeft.text(timeLeft);
		nextTrain.text(nTrainCon2);

		newRow.append(newName, newDest, newFreq, nextTrain, tLeft, newTrain);
		$("#train-table").append(newRow);
	}
}, (err) => {
	console.log("The read failed: " + err.code);
});

$("#submit-btn").on("click", () => {
	var trainName = $("#name-input").val().trim();
	var trainFreq = $("#trainFreq-input").val().trim();
	var trainFirst = $("#fTrain-input").val().trim();
	var trainDest = $("#destination-input").val().trim();

	database.ref().push({
		name: trainName,
		frequency: trainFreq,
		fTrain: trainFirst,
		destination: trainDest
	})
});