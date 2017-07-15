import { Component, ViewChild } from '@angular/core'
import { NavController } from 'ionic-angular'
import { Chart } from 'chart.js'
import * as moment from 'moment'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('barCanvas') barCanvas

  barChart: any

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [
          moment().format('mm:ss'),
          moment().add(1, 'minutes').format('mm:ss'),
          moment().add(2, 'minutes').format('mm:ss'),
          moment().add(3, 'minutes').format('mm:ss'),
          moment().add(4, 'minutes').format('mm:ss')
        ],
        datasets: [
          {
            backgroundColor: ['#2727e6'],
            label: 'Temperature',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }
}
