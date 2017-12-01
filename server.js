const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const SerialPort = require("serialport");
const port = process.env.PORT || 3000;

var DataFromArduino = "on";
var DataToWeb = "on";
var serialPort;


//----------------------------------------------SERVER MANAGEMENT--------------------------------------------
///build path of the project
app.use(express.static(path.join(__dirname, 'dist')));

//redirect to index page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


//--------------------------------------SOCKET COMMUNICATION WITH BROWSER-------------------------------
const io = socketIO(server);

var LedStatus = 'OFF';

io.on('connection', (socket) => {
    console.log('Web page connected to socket connection!');
    
    //send incoming data from arduino to web browser
    socket.emit('getLedStatus',DataToWeb);
    
    //send incoming data from web browser to arduino
    socket.on('setLedStatus',(data) => {
        serialPort.write(data + 'E');

        //untill arduino connected i need to check
        socket.emit('updateData', data);
      });

    //update web page values when button press pass values to the socket
    socket.on('update', (data) => {
        // socket.emit('updateData', (data))
    });

    //print disconnected when web page closed
    socket.on('disconnect', () => {
        console.log('Web page disconnected!');
    });
});



///--------------------------------------------SERIAL COMMUNICATION----------------------------------------

var portName = 'COM3'; //change this to your Arduino port
    
serialPort = new SerialPort(portName, {
    baudRate: 9600
});

serialPort.on("open", () => {
    console.log('Arduino board connected to serial port!');
    
    // Listens to incoming data from Arduino board
    serialPort.on('data', (data) => {
        DataFromArduino += data.toString();
        if (DataFromArduino .indexOf('E') >= 0 && DataFromArduino .indexOf('B') >= 0) {
        DataToWeb = DataFromArduino .substring(DataFromArduino .indexOf('B') + 1, DataFromArduino .indexOf('E'));
        DataFromArduino = '';
        }
        
        // send the incoming data to browser to updateData method in socket section with websockets.
        io.emit('update', DataToWeb);
    });  
});




///-------------------------ARDUINO SETUP WITH SERIAL PORT---------
/*
// LED read vars
String inputString = "";         // a string to hold incoming data
boolean toggleComplete = false;  // whether the string is complete

// initialize serial:
Serial.begin(9600);


// Recieve data from Node and write it to a String
   while (Serial.available() && toggleComplete == false) {
    char inChar = (char)Serial.read();
    if(inChar == 'E'){ // end character for toggle LED
     toggleComplete = true;
    }
    else{
      inputString += inChar; 
    }
  }

  if(!Serial.available() && toggleComplete == true)
  {
    ///light up the LED
  }

*/