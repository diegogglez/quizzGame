import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, HttpClientModule],
})
export class HomePage {

  constructor(
    private router: Router,
    public alertController: AlertController) {}

  start() {
    this.showStartAlert();
  }

  async showStartAlert() {
    const alert = await this.alertController.create({
      header: '¿quieres empezar de 0?',
      message: 'Si empiezas una partida de 0, todo tu progreso se perderá',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            localStorage.setItem('questionNumber', '0');
            this.router.navigate(['/game']);
          }
        },
        {
          text: 'CANCEL',
        }
      ]
    })
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  continue() {
    this.router.navigate(['/game']);
  }
}
