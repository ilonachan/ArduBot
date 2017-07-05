function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

function anfordern(mode) {
	var req = createCORSRequest('GET',"http://"+document.getElementById("arduIP").value+"/request.php?comm="+mode);
	if(!xhr) {
		console.err("CORS is not supported in your browser. That means this page can send no requests to "
			    + "the robot as it is not to be found on the same domain. (Find out why at "
			    + "https://en.wikipedia.org/wiki/Same-origin_policy")
	}
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
		case 37: 
			wheel.lerpTo(-wheel.maxSteerAngle);
			return;
		case 38:
			wheel.lerpTo(wheel.maxSteerAngle);
			return;
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
		case 37: 
		case 38:
			wheel.lerpTo(0);
			return;
		default:
			return;
	}
	document.getElementById("buttonSteer"+str).classList.remove("activate");
	setDir(str,0);
}
