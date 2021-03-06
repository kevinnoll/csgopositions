import { Component, ViewChild } from '@angular/core';
import { firebaseConfig } from '../../app/app.module';
import { Http } from '@angular/http';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { MapData } from '../../providers/map-data';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { SubmitPage } from '../submit/submit';
import { UserPage } from '../user/user';

/*
  Generated class for the StrategyDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-strategy-detail',
  templateUrl: 'strategy-detail.html'
})
export class StrategyDetailPage {
  @ViewChild('container') container;
  public height: any;
  private spotId: string;
  public color;
     
  public safeVidUrl : any;

  public spot = {
    id : "",
    title : "",
    strategy : "",
    mapName : "",
    startSeconds : 0, 
    endSeconds : 0,
    videoId : "",
    picture_1 : "",
    picture_2 : "",
    picture_3 : "",
    rating: 0,
    published: true
  }

  public afRatingRef: FirebaseObjectObservable<any>;

  constructor(public http: Http, public toastCtrl: ToastController, private angularFireDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public mapData: MapData, private sanitizer: DomSanitizer) {
    this.angularFireDatabase = angularFireDatabase;
    this.spotId = navParams.get("spotId");
    this.afRatingRef = this.angularFireDatabase.object('/fspots/' + this.spotId + '/rating');
    this.displaySpot();
  }

  nextSpot() {
    this.mapData.getNextSpot(this.spot.mapName, this.spot.strategy, this.spot.id).then(nextSpot => {
      this.navCtrl.push(StrategyDetailPage, {
        spotId : nextSpot.id
      });
    });
  }

  previousSpot() {
    this.mapData.getPreviousSpot(this.spot.mapName, this.spot.strategy, this.spot.id).then(nextSpot => {
      this.navCtrl.push(StrategyDetailPage, {
        spotId : nextSpot.id
      });
    });
  }

  displaySpot() {     
    this.afRatingRef.subscribe();
    this.mapData.getSpot(this.spotId).subscribe(spot => {
      this.spot = spot;
    });
  }

  acceptSpot(spotId) {
    this.http.get(firebaseConfig.functionsURL + '/publish?id=' + spotId).map(data => {

      // todo: make response readable
      this.presentToast(data);
    }).subscribe();
 }

 presentToast(message) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 7000
  });
  toast.present();
}

  isUnpublished () {
    return !this.spot.published;
  }

  isGrenade () {
    return this.spot.strategy === 'smoke' || this.spot.strategy === 'decoy' || this.spot.strategy === 'brand';
  }

  isSpot () {
    return this.spot.strategy === 'awp' || this.spot.strategy === 'spot';
  }

  getVoteObject() {
    if (typeof(Storage) !== "undefined") {
      if (!localStorage.getItem("votes")) {
        localStorage.setItem("votes", "[]");
      } 
      return JSON.parse(localStorage.getItem("votes"));
    }
    return [this.spotId]; //means: users with no storage already voted.
  }
  
  setVoteObject(votes) {
    if (typeof(Storage) !== "undefined" && votes) {
      localStorage.setItem("votes", JSON.stringify(votes));
    }
  }

  mayVote() {
    let votes = this.getVoteObject();
    if (!votes.includes(this.spotId)) {
      return true;  
    }
    return false;
  }

  openSubmitPage() {
    this.navCtrl.push(SubmitPage);
  }

  saveVote() {
    let votes = this.getVoteObject();
    votes.push(this.spotId);
    this.setVoteObject(votes);
  }

  vote(direction: boolean) {
    let delta = direction ? 1 : -1;    
    if (this.mayVote()) {
      this.spot.rating += delta;

      this.afRatingRef.set(this.spot.rating);
      this.saveVote();
    }
  }

  userPressed (spot) {
    this.navCtrl.push(UserPage, {
      displayName: spot.displayName
    });
  }

  ionViewDidLoad() {
    ga('set', 'page', '/strategy-detail');
    ga('send', 'event', "page", "visit", "stragety-detail");
    ga('send', 'event', "spot", "selected", this.spotId);

    console.log('ionViewDidLoad StrategyDetailPage');
  }

}
