import { Component, NgZone } from '@angular/core'
import {  NavController, Platform } from 'ionic-angular'
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation'
import { Geolocation } from '@ionic-native/geolocation'
import * as moment from 'moment'
import axios from 'axios'

class Location {
  public lat: any
  public lng: any
  public timestamp: number
}

@Component({
  selector: 'page-log',
  templateUrl: 'log.html'
})
export class LogPage {
  log = []
  location = new Location()

  config: BackgroundGeolocationConfig = {
    desiredAccuracy: 0,
    stationaryRadius: 20,
    distanceFilter: 30,
    startOnBoot: true,
    stopOnTerminate: false,
    notificationTitle: 'MCQ',
    notificationText: 'Enabled'
  }

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public backgroundGeolocation: BackgroundGeolocation,
    public zone: NgZone
  ) {
    // Starts tracking right away
    backgroundGeolocation.configure(this.config).subscribe(
      (location: BackgroundGeolocationResponse) => {
        this.zone.run(() => {
          this.location.lat = location.latitude
          this.location.lng = location.longitude
          this.location.timestamp = moment().unix()
          this.log.push(`[${this.getTime()}] Location found. Publishing...`)

          // Publishes location to API
          this.publishLocation(this.location.lat, this.location.lng)
        })
      },
      err => {
        this.log.push(`[${this.getTime()}] Error finding device location`)
        backgroundGeolocation.start()
      }
    )
    backgroundGeolocation.start()
  }

  getTime() {
    return moment().format('hh:mm:ss')
  }

  async publishLocation(lat, lng) {
    try {
      // This IP hosts a proxy to the Multicast API
      await axios.post('http://45.79.86.219:9861/publish', { lat, lng })

      this.log.push(`[${this.getTime()}] Location published successfully`)
    } catch (err) {
      this.log.push(`[${this.getTime()}] Error publishing location to API`)
    }
  }

  async findLocation() {
    try {
      const position = await this.geolocation.getCurrentPosition()

      this.location.lat = position.coords.latitude
      this.location.lng = position.coords.longitude
      this.location.timestamp = moment().unix()
      this.log.push(`[${this.getTime()}] Location found manually`)

      this.publishLocation(this.location.lat, this.location.lng)
    } catch (err) {
      this.log.push(`[${this.getTime()}] Error finding location manually`)
    }
  }

  exitApp(){
    this.backgroundGeolocation.stop()
    this.platform.exitApp()
  }
}
