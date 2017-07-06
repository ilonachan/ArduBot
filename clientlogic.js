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
	var req = new XMLHttpRequest();
-	req.open("get", "request.php?comm="+mode, true);
	req.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
	// console.log("Sending request: 'request.php?comm="+mode+"'");
	if(mode == "refresh") {
		req.onreadystatechange = function(e){
			if(e.target.readyState == 4 && e.target.status == 200) {
				// console.log(e.target.responseText);
				refreshView(e.target.responseText);
			}
		}
	} else {
		req.onreadystatechange = auswerten;
	}
	req.send();
}

function auswerten(e) {
	if(e.target.readyState == 4 && e.target.status == 200)
		// console.log(e.target.responseText);
		showCommandFeedback(e.target.responseText);
}

document.addEventListener("keydown", checkKeyDown);
document.addEventListener("keyup", checkKeyUp);

setInterval(everySec,1000);

function refreshView(info){
	document.getElementById("textStatus").innerHTML = info;
}

var timeoutDelText;

function showCommandFeedback(info){
	if(timeoutDelText)
		clearTimeout(timeoutDelText)
	
	document.getElementById("textFeedback").innerHTML = info;
	
	timeoutDelText = setTimeout(function() {
		document.getElementById("textFeedback").innerHTML = "&nbsp;";
	}, 1200);
}

function everySec() {
	// console.log("refresing");
	anfordern("refresh");
}

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
		default:
			return;
	}
	document.getElementById("buttonSteer"+str).classList.remove("activate");
	setDir(str,0);
}

function submitDisplayText() {
	anfordern("display&setto="+document.getElementById("inputDisplayText").value);
}