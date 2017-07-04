function anfordern(mode) {
	var req = new XMLHttpRequest();
	req.open("get", "request.php?comm="+mode, true);
	req.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
	// console.log("Sending request: 'request.php?comm="+mode+"'");
	// if(mode == "refresh") {
		// req.onreadystatechange = function(e){
			// if(e.target.readyState == 4 && e.target.status == 200) {
				// console.log(e.target.responseText);
				// refreshView(e.target.responseText);
			// }
		// }
	// } else {
		req.onreadystatechange = auswerten;
	// }
	req.send();
}

function auswerten(e) {
	if(e.target.readyState == 4 && e.target.status == 200)
		console.log(e.target.responseText);
}

document.addEventListener("keydown", checkKeyDown);
document.addEventListener("keyup", checkKeyUp);

// setInterval(everySec,1000);

// function refreshView(info){
	// document.getElementById("idStatus").innerHtml = info;
// }

// function everySec() {
	// // console.log("refresing");
	// anfordern("refresh");
// }

var dirs = {
	Up:0, Down:0, Left:0, Right:0
};

function setDir(dir, bool) {
	if(dirs[dir] == bool)
		return;
	dirs[dir] = bool;
	anfordern("move-"+dir+"-"+bool);
}

function checkKeyDown(e) {

	e = e || window.event;
	
	var str;
	switch(e.keyCode) {
		case 38: str="Up"; break;
		case 40: str="Down"; break;
		case 37: str="Left"; break;
		case 39: str="Right"; break;
		default:
			return;
	}
	document.getElementById("buttonSteer"+str).classList.add("activate");
	setDir(str,1);
}

function checkKeyUp(e) {

	e = e || window.event;
	
	var str;
	switch(e.keyCode) {
		case 38: str="Up"; break;
		case 40: str="Down"; break;
		case 37: str="Left"; break;
		case 39: str="Right"; break;
		default:
			return;
	}
	document.getElementById("buttonSteer"+str).classList.remove("activate");
	setDir(str,0);
}

var wheel = new Wheel("https://raw.githubusercontent.com/thepikafan/ArduBot/master/wheel/wheel.png",360,373,
	{container:document.getElementById("wheelContainer"),
		onSteer:function(e) {
		if(e.angle < -40)
			setDir("Left" ,1);
		if(e.angle > +40)
			setDir("Right",1);
		if(e.angle >= -40 && e.angle <= +40) {
			setDir("Left" ,0);
			setDir("Right",0);
		}
	},radius:128});
