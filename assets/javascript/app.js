 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBK2wN0Id4n7p3UDfzGHrdHamknB4-cjuw",
    authDomain: "train-time-17acc.firebaseapp.com",
    databaseURL: "https://train-time-17acc.firebaseio.com",
    projectId: "train-time-17acc",
    storageBucket: "train-time-17acc.appspot.com",
    messagingSenderId: "509074017413"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

$("#submitButton").on("click", function() {
  //Don't refresh the page!
  // event.preventDefault(); 
  var name = $("#trainName").val().trim();
  var destination = $("#trainDestination").val().trim();
  var firstTrainTime = $("#firstTrainTime").val().trim();
  var frequency = $("#trainFrequency").val().trim();
  var train = {
    name:  name,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  }

  // Change what is saved in firebase
  database.ref().push(train);

  // Logs everything to console
  console.log(train.name);
  console.log(train.destination); 
  console.log(train.firstTrainTime);
  console.log(train.frequency);

  // Alert
  // alert("Train successfully added");

  $("#trainName").val("");
  $("#trainDestination").val("");
  $("#firstTrainTime").val("");
  $("#trainFrequency").val("");
});
  
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainFrequency = childSnapshot.val().frequency;
  var trainFirstTime = childSnapshot.val().firstTrainTime;
  var y = Number(trainFirstTime.slice(3,5));  
  var x = Number(trainFirstTime.slice(0,2));
  var z = 60 * x + y;

  // calculate time of last arrival
  var h = Number(moment().format('h'));
  console.log(h);
  var m = Number(moment().format('mm'));
  console.log(m);
  var l = 60 * h + m;
    if (z > l) {
    var minutesAway = trainFrequency - ((1440 - z + l)%(trainFrequency));
    var nextArrival = moment().add(minutesAway, "m").format("hh:mm A");
    }
    else {
    var minutesAway = trainFrequency - (l - z)%(trainFrequency);
    var nextArrival = moment().add(minutesAway, "m").format("hh:mm A");
    }

  $("#trainTimeTable").append("<tr><td>" + 
    trainName + "</td><td>" + 
    trainDestination + "</td><td>" + 
    trainFrequency + "</td><td>" + 
    nextArrival + "</td><td>" + 
    minutesAway + "</td></tr>");  
});

function displayTime() {
  setInterval(function currentTime() {
  var t = moment().format('h:mm A');
  var s = moment().format('ss');
  console.log(s);
  $('#currentTime').html(t);
    if (s === "00") {
// not ideal. I need to figure out another way to update info in real time
      location.reload();
    }
  }, 1000);
}

displayTime();