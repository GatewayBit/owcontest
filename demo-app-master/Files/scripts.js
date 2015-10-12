// var gameTitleStr = "Robocraft";
// var gameID = 104801;

overwolf.games.getRunningGameInfo(
    function (value) {
	if (value === null) {
	    console.log("No game detected.");

	    // Please re-enable this when you ship!!!!!!
	    //CloseWindow("No game detected, please launch Robocraft first!");
	}
	else {
	    if (value.title != "Robocraft" || value.id != 104801){
		console.log("Please re-run this app when Robocraft is running.");
		CloseWindow("Robocraft not detected. Try re-launching Robocraft.");
	    }
	    else {
		console.log("We are running Robocraft! No messages needed! :)");
		InitData();
	    }
	}
    }
);

function CloseWindow(message) {
    overwolf.windows.getCurrentWindow(function(result){
	if (result.status=="success"){
	    alert(message);
	    overwolf.windows.close(result.window.id, function (value){
		console.log(value);
	    });
	}
    });
}

overwolf.settings.registerHotKey(
	"capture",
	function(arg) {
	    if (arg.status === "success") {
		capture();
	    }
	}
);

function InitData() {
    // Possibly add a cool .gif loading anitmation instead of just ---
    document.getElementById("username").innerHTML = "Username: " + "---";
    document.getElementById("playerLevel").innerHTML = "Level: " + "---";
    document.getElementById("lastGameResult").innerHTML = "Last Game Results: " + "---";
    document.getElementById("rpReward").innerHTML = "RP Reward: " + "---";
}

// This block may not be needed!
// Originally intended for detecting if the game was running
// or not but this issue has been resolved as seen above!
/*
var gameInfoLaunched;
overwolf.games.onGameLaunched.addListener(
    function (value) {
	console.log(value);
	gameInfoLaunched = value;
	console.log("This should say Robocraft or something.");
    }
);

var gameInfoUpdate;
overwolf.games.onGameInfoUpdated.addListener(
    function (value) {
	console.log(value);
	gameInfoUpdate = value;
	console.log("onGameInfoUpdated Fired!");
    }
);
*/

var playerDataInfoUpdates;
overwolf.games.events.onInfoUpdates.addListener(
    function (value) {
	console.log("INFO UPDATES LISTENER STARTED!");
	console.log(value);

	fullDataList(value);

	//console.log("Pushing data -> playerInfo()");
	//playerInfo(value);

	// May not be needed later.
	// Keeping for debug purposes at the moment.
	playerDataInfoUpdates = value;
    }
);

function fullDataList(data){
    console.log("[DEV] Inside fullDataList method.");

    for (var i = 0; i < data.info.length; i++) {
	console.log("Category:" + data.info[i].category + " Key:" + data.info[i].key + " Value:" + data.info[i].value);

	// The following are for updating the form with data.
	if (data.info[i].category === "playerData" && data.info[i].key === "username") {
	    document.getElementById("username").innerHTML = "Username: " + data.info[i].value;
	}

	if (data.info[i].category === "playerData" && data.info[i].key === "playerLevel") {
	    document.getElementById("playerLevel").innerHTML = "Level: " + data.info[i].value;
	}

	if (data.info[i].category === "playerData" && data.info[i].key === "lastGameResult") {
	    document.getElementById("lastGameResult").innerHTML = "Last Game Results: " + data.info[i].value;
	}

	if (data.info[i].category === "lastGameRewards" && data.info[i].key === "rpReward") {
	    document.getElementById("rpReward").innerHTML = "RP Reward: " + data.info[i].value;
	}
    }
}

// This block is currently unused and has no purpose at the moment.
/*
function playerInfo(data){
    console.log("[DEV] Inside playerInfo method.");
    console.log(data);

    for (var i = 0; i < data.info.length; i++) {
	if(data.info[i].category === "playerData"){
	    console.log(data.info[i].key + ": " + data.info[i].value);
	}

    }

}
*/


// Honestly not sure what this is for but
// I have it here anyway!

// [DEV NOTE] Does not return data if no errors?
var playerErrorEvents;
overwolf.games.events.onError.addListener(
    function (value) {
	console.log(value);
	console.log("ERROR EVENT LISTENER STARTED.");
	playerErrorEvents;
    }
);

// Having issues getting this to work properly
// still waiting on contact from FJ devs.
var playerDataNewEvents;
overwolf.games.events.onNewEvents.addListener(
    function (value) {
	for(var i = 0; i < value.events.length; i++)
	{
	    console.log('event name');
	    console.log(value.events[i].name);
	}
    }
);

function dragResize(edge){
    overwolf.windows.getCurrentWindow(function(result){
	if (result.status=="success"){
	    overwolf.windows.dragResize(result.window.id, edge);
	}
    });
};

function dragMove(){
    overwolf.windows.getCurrentWindow(function(result){
	if (result.status=="success"){
	    overwolf.windows.dragMove(result.window.id);
	}
    });
};

function closeWindow(){
    overwolf.windows.getCurrentWindow(function(result){
	if (result.status=="success"){
	    overwolf.windows.close(result.window.id);
	}
    });
};

function openSubWindow(){
    alert("the subwindow will only be visible inside a game");
    overwolf.windows.obtainDeclaredWindow("SubWindow", function(result){
	if (result.status == "success"){
	    overwolf.windows.restore(result.window.id, function(result){
		console.log(result);
	    });
	}
    });
};

function enableReplay(){
    var settings = {
	"settingsxxxx": {
	    "audio": {
		"mic": {
		    "volume": 100,
		    "enabled": true
		},
		"game": {
		    "volume": 100,
		    "enabled": true
		}
	    },
	    "peripherals": {
		"capture_mouse_cursor": "both"
	    }
	}
    }

    overwolf.media.replays.turnOn(settings, function (result){
	if (result.status === "success") {
	    document.getElementById("replayStatus").innerHTML = "Replay Status = On";
	    console.log(result);
	}
	else {
	    alert(result.error);
	    console.log(result);
	}
    });
}


function disableReplay(){
    overwolf.media.replays.turnOff(function(result){
	if (result.status === "success") {
	    document.getElementById("replayStatus").innerHTML = "Replay Status = Off";
	}
	else if (result.status === "error") {
	    alert(result.error);
	}
	console.log(result);
    });
}

// This method is very buggy and does not work
// properly at the moment. Hopefully will be fixed
// in the future!

var replayID;
function startCapture(){
    overwolf.media.replays.startCapture(30000, function(result){
	replayID = result.url;
	console.log(result);
    });
}

//var replayID;
function capture(){
    overwolf.media.replays.capture(2500, 10000,
				   function(finished){
				       console.log("finished callback");

				       if (finished.status === "error") {
					   alert(finished.error);
				       }
				       document.getElementById("captureStatus").innerHTML = "Recording = Off";

				       console.log(finished);
				   },
				   function(results){
				       if (results.status === "success") {
					   replayID = results.url;
					   document.getElementById("captureStatus").innerHTML = "Recording = On";
				       }
				       if (results.status === "error"){
					   alert(results.error);
				       }
				       console.log("Spitting results now");
				       console.log(results);
				   });
}

function finishCapture(){
    overwolf.media.replays.finishCapture(replayID, function(result){
	if (result.status === "error") {
	    alert(result.error);
	}
	console.log(result);
    });
}
