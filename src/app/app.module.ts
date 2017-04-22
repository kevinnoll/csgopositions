import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SelectPage } from '../pages/select/select';
import { MapOverviewPage } from '../pages/map-overview/map-overview';
import { WelcomePage } from '../pages/welcome/welcome';
import { StrategyDetailPage } from '../pages/strategy-detail/strategy-detail';

import { MapData } from '../providers/map-data';

import { AngularFireModule } from 'angularfire2';

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyDIaR2jO4z66WRv_cA_8bzJw3QnoIqxkvA",
  authDomain: "csgospots-1f294.firebaseapp.com",
  databaseURL: "https://csgospots-1f294.firebaseio.com",
  storageBucket: "csgospots-1f294.appspot.com",
  messagingSenderId: "743445555111",
  projectId: "csgospots-1f294",
};

@NgModule({
  declarations: [
    MyApp,
    SelectPage,
    MapOverviewPage,
    WelcomePage,
    StrategyDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {}, {
     links: [
       { component: SelectPage, name: 'Select', segment: 'maps/:mapName' },
       { component: MapOverviewPage, name: 'MapOverview', segment: 'maps/:mapName/:strategyId/:intentionName' },
       { component: StrategyDetailPage, name: 'StrategyDetail', segment: 'maps/:mapName/:strategyId/:intentionName/:spotId' }
     ]
    }),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SelectPage,
    MapOverviewPage,
    WelcomePage,
    StrategyDetailPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, MapData]
})
export class AppModule {}
