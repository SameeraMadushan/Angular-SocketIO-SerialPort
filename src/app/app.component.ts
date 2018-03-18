import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';
import { parse } from 'querystring';
import { Chart, pattern } from 'chart.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  socket: any;
  image: any;
  power: any;
  obsvr: any;
  temperature: any;
  doughnutChart : any;


  constructor() {
    this.socket = io('http://localhost:3000/');
  }

  public ngOnInit(): void {

//---------------------------------------initializing chart--------------------------
    const chartHtml = document.getElementById('myChart'); 
    const doughnutGraphData = {
      datasets: [{
        data: [1, 20],
        backgroundColor: ['#ff6384', '#FFFF'],
      }],
      labels: [
        'Temperature'
      ]
    };
    this.doughnutChart = new Chart(chartHtml, {
      type: 'doughnut',
      data: doughnutGraphData,
      options: {
        animation:{
          animateRotate : true,
          animateScale : false
        },
        cutoutPercentage: 50,
        rotation : 9.42,
        circumference: 3.12
      }
    });
    //------------------------------------------------------------------------------

    this.temperature = "0";
    this.obsvr = this.getLatestUpdate().subscribe(message => {
      this.temperature = message;

      //pop old data and push new data to the JSON array
      this.doughnutChart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
        dataset.data.pop();
        dataset.data.push(message);
        dataset.data.push("30");
      });
      this.doughnutChart.update(0);       //update JSON

    })
  }

  getLatestUpdate(): any {
    let observable = new Observable(observer => {
      this.socket.on('getLedStatus', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }


  onclick(command: any) {
    // if (command == "ON") {
      let a = Math.floor(Math.random() * 100);
      this.socket.emit("setLedStatus", a.toString());
    // }
  }


  changeLedStatus() {
    if (this.power == "on") {
      this.image = "../assets/On.png";
    }
    else if (this.power == "off") {
      this.image = "../assets/Off.png";
    }
  }

}






// old code with mdbootstrap chart



/**
 * import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';
import { parse } from 'querystring';
import { ChartsModule, Color } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  socket: any;
  image: any;
  power: any;
  obsvr: any;
  temperature: any;

  // public chartType: string = 'doughnut';

  // public chartData: Array<any> = [0, 20];

  // public chartLabels: Array<any> = ['Temperature'];

  // public chartColors: Array<any> = [{
  //   hoverBorderColor: ['rgba(0, 0, 0, 0.1)', "rgba(0, 0, 0)"],
  //   hoverBorderWidth: 0,
  //   backgroundColor: ["#F7464A", "#007bff"],
  //   hoverBackgroundColor: ["#FF5A5E", "#007bff"]
  // }];

  // labels: string[] = ['Temperature', 'asss'];
  // data: number[] = [0, 20];
  // type: string = 'doughnut';

  // colorsUndefined: Array<Color>;

  // public chartOptions: any = {
  //   responsive: true
  // };



  constructor() {
    this.socket = io('http://localhost:3000/');
  }

  public ngOnInit(): void {
    this.power = "off";
    this.changeLedStatus();
    this.temperature = "10";
    // this.chartData[0]= parseInt(this.temperature);

    // this.chartData.pop();
    // this.chartData.pop();
    // this.chartData.push(12);
    // this.chartData.push(parseInt(this.temperature));
    
    // this.chartData.update(0);
    this.obsvr = this.getLatestUpdate().subscribe(message => {
      // this.power = message;
      this.temperature = message;
      this.changeLedStatus();
      // this.chartData[0]= parseInt(message);


      // this.chartData.pop();
      // this.chartData.pop();
      // this.chartData.push(12);
      // this.chartData.push(parseInt(message));
      
      // this.chartData.update(0);
      console.log(parseInt(message))
    })
  }

  onclick(command: any) {
    if (command == "ON") {
      this.socket.emit("setLedStatus", "on");
    }
  }

  getLatestUpdate(): any {
    let observable = new Observable(observer => {
      this.socket.on('getLedStatus', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  changeLedStatus() {
    if (this.power == "on") {
      this.image = "../assets/On.png";
    }
    else if (this.power == "off") {
      this.image = "../assets/Off.png";
    }
  }




  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }

}

 * 
 * 
*/
