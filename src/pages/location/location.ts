import { Component, NgZone, ViewChild, ElementRef } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation'
import { Geolocation } from '@ionic-native/geolocation'
import * as moment from 'moment'

declare var google

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html'
})
export class LocationPage {
  @ViewChild('map') mapElement: ElementRef

  map: any
  locationText: any = 'Finding location...'
  location: any

  config: BackgroundGeolocationConfig = {
    desiredAccuracy: 1000,
    stationaryRadius: 20,
    distanceFilter: 30,
    startOnBoot: true,
    stopOnTerminate: false
  }

  constructor(
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public backgroundGeolocation: BackgroundGeolocation,
    public zone: NgZone
  ) {}

  ionViewDidLoad() {
    this.loadMap()

    this.backgroundGeolocation.configure(this.config).subscribe(
      (location: BackgroundGeolocationResponse) => {
        this.zone.run(() => {
          // this.location = location
          this.locationText = `${location.latitude}, ${location.longitude} (${moment(
            location.time
          ).format('hh:mm A')})`
        })
        // console.log(JSON.stringify(location))
      },
      err => console.log(err)
    )

    // start recording location
    this.backgroundGeolocation.start()
  }

  loadMap() {
    // TODO: check if location is enabled
    this.geolocation
      .getCurrentPosition()
      .then(position => {
        // console.log(position.coords.latitude)
        // console.log(position.coords.longitude)

        let latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        )

        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.map.getCenter()
        })
      })
      .catch(console.error)
  }
}
