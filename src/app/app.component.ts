import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  socket: any;
  cards: any;
  LedStatus: any;

  constructor() {
    this.socket = io();
  }

  public ngOnInit(): void {

    ///get and set initial value from the socket
    this.socket.on('getLedStatus', (ledStatus) => {
      this.LedStatus = ledStatus;
      console.log(ledStatus + ' Initial Values');
    });
    setTimeout(() => {
      //change led status when page open
      this.changeLedStatus();
      console.log(this.LedStatus);
    }, 1000);
  }

  changeLedStatus() {
    if (this.LedStatus == "on") {
      this.cards = [{
        title: "LED STATUS " + this.LedStatus,
        button: "OFF",
        url: "../assets/On.png"
      }];
    }
    else if (this.LedStatus == "off") {
      this.cards = [{
        title: "LED STATUS " + this.LedStatus,
        button: "ON",
        url: "../assets/Off.png"
      }];
    }
  }


  onclick(command: any) {
    if (command == "ON") {
      this.socket.emit("setLedStatus", "on");
      // this.socket.emit("update", "on");
      this.socket.on('updateData', (ledStatus) => {
        this.LedStatus = ledStatus;
        console.log(ledStatus + ' ON pressed');
      });
      setTimeout(() => {
        //set changes acording to the client message
        this.changeLedStatus();
        console.log("ON");
      }, 500);
      
    }
    else if (command == "OFF") {
      this.socket.emit("setLedStatus", "off");
      // this.socket.emit("update", "off");
      this.socket.on('updateData', (ledStatus) => {
        this.LedStatus = ledStatus;
        console.log(ledStatus + ' OFF pressed');
      });
      setTimeout(() => {
        //set changes acording to the client message
        this.changeLedStatus();
        console.log("OFF");
      }, 500);
      
    }
  }

}
