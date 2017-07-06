#include <ESP8266WiFi.h>
#include <Arduino.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* ssid = "Projektwoche2017";
const char* password = "prowo2017";
const char* rawgitFingerprint = "CC AA 48 48 66 46 0E 91 53 2C 9C 7C 23 2A B1 74 4D 29 9D 33"; //certificate fingerprint of github.com
const char* rawgitURL = "http://rawgit.com/thepikafan/ArduBot/master/controlpanel.html";

WiFiServer server(80);

void initWiFi(){
  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  //Connects to a WiFi network
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  //Waits until connection is established
  while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  
  // Start the server
  server.begin();
  Serial.println("Server started");
  
  // Print the IP address
  Serial.print("Use this URL to connect: ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/controlpanel.html");
}

void setup() {
  Serial.begin(115200);
  delay(10);
  
  initWiFi();
  
  //Do whatever setup you guys need HERE
  
}

/**
 * Returns a JSON string containing all the relevant status information about the robot.
 */
String getStatusAsJSON() {
  
  //Tell me about the status of the Arduino (in JSON form, if possible)
  
}

/**
 * triggers a movement of the robot to the specified direction. percent will likely be either 0 or 1, for 'move' and 'dont move'.
 */
void setMotorMovement(String direction, float percent) {
  
}

/**
 * Changes the text displayed on the robot's binary display.
 */
void setDisplayText(String newText) {
  
}


void sendControlPanelHTML(WiFiClient &requester) {
  Serial.println("Streaming Website from rawgit.com");
  
  Stream *stream = &requester;
  
  
  //The HTTPClient for the requests
  HTTPClient http;
  int httpCode;

  //begins a HTPPS connection with URL and checks certificate with fingerprint
  http.begin(rawgitURL); //HTTPS
  
  //performs the HTTP GET command and stores he return code
  httpCode = http.GET();

  // httpCode will be negative on error
  if(httpCode > 0) {
    // file found at server
    if(httpCode == HTTP_CODE_OK) {
      // get lenght of document (is -1 when Server sends no Content-Length header)
      int len = http.getSize();

      // create buffer for read
      uint8_t buff[128] = { 0 };

      // get tcp stream
      WiFiClient* client = http.getStreamPtr();

      // read all data from server
      while(http.connected() && (len > 0 || len == -1)) {
        // get available data size
        size_t size = client->available();

        if(size) {
          // read up to 128 byte
          int c = client->readBytes(buff, ((size > sizeof(buff)) ? sizeof(buff) : size));

          // write it to Serial
          stream->write(buff, c);

          if(len > 0) {
            len -= c;
          }
        }
        delay(1);
      }
    }
  } else {
    Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
  
  
  requester.flush();
}

void handleRequest(String request,WiFiClient &client){
  Serial.println("Request paarams: '"+request+"'");
  int pos = request.indexOf("&");
  if(pos == -1) pos = request.length()-1;
  String comm = request.substring(request.indexOf("comm=")+5,pos);
  if(pos < request.length()) request = request.substring(pos+1);
  
  // Return the response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/plain");
  client.println(""); // do not forget this one
  
  if(comm="move-Up-1") { setMotorMovement("up", 1); client.println("Moving up"); }
  if(comm="move-Up-0") { setMotorMovement("up", 0); client.println("Stopping up"); }
  if(comm="move-Down-1") { setMotorMovement("down", 1); client.println("Moving down"); }
  if(comm="move-Down-0") { setMotorMovement("down", 0); client.println("Stopping down"); }
  if(comm="move-Left-1") { setMotorMovement("left", 1); client.println("Moving left"); }
  if(comm="move-Left-0") { setMotorMovement("left", 0); client.println("Stopping left"); }
  if(comm="move-Right-1") { setMotorMovement("right", 1); client.println("Moving right"); }
  if(comm="move-Right-0") { setMotorMovement("right", 0); client.println("Stopping right"); }
  if(comm="refresh") { client.println("Status: "+getStatusAsJSON()); }
  if(comm="display") {
    int pos = request.indexOf("&");
    if(pos == -1) pos = request.length()-1;
    String setto = request.substring(request.indexOf("setto=")+5,pos);
    if(pos < request.length()) request = request.substring(pos+1);
    setDisplayText(setto);
    client.println("Display set to "+setto);
  }
  client.flush();
}

void workWiFi(){
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
  return;
  }
  
  // Wait until the client sends some data
  Serial.println("new client");
  while(!client.available()){
  delay(1);
  }
  
  // Read the first line of the request
  String request = client.readStringUntil('\r');
  Serial.println(request);
  
  if (request.indexOf("/request.php?") != -1) {

    String req = request.substring(request.indexOf("/request.php?")+13);
    handleRequest(req, client);
  } else {
    sendControlPanelHTML(client);
  }
  
  delay(1);
  Serial.println("Client disonnected");
  Serial.println("");
}

void loop() {
  workWiFi();
  
  //Do whatever you want HERE
}
