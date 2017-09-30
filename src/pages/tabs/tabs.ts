import { Component } from '@angular/core'

import { AboutPage } from '../about/about'
import { LogPage } from '../log/log'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab3Root = LogPage
  tab1Root = AboutPage

  constructor() {}
}
