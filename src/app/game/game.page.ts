import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule, 
    FormsModule, 
    RouterModule, 
    ReactiveFormsModule
  ]
})
export class GamePage implements OnInit {

  questions: any = [];
  wrongAnswers: any = [];
  questionTitle: any;
  questionAnswer: any;
  helpAnswer: any;
  questionNumber: any;
  formSendAnswer: FormGroup;

  constructor(
    private apiService: ApiService, 
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public router: Router) { 

    this.formSendAnswer = this.formBuilder.group({
      answer: ['', Validators.required]
    })
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.getQuestions();
    this.getWrongAnswers();
    this.questionNumber = localStorage.getItem('questionNumber');
    if (!this.questionNumber) {
      this.questionNumber = 0
    }
  }

  getQuestions() {
    this.apiService.getQuestions().subscribe(
      (res) => {
        this.questions = res;
        this.questionTitle = this.questions[this.questionNumber].question;
        this.questionAnswer = this.questions[this.questionNumber].answer;
        this.helpAnswer = this.questions[this.questionNumber].help;
        console.log(this.questions);
      }, (err) => {
        console.error(err);
      }
    )    
  }

  getWrongAnswers() {
    this.apiService.getWrongAnswers().subscribe(
      (res) => {
        this.wrongAnswers = res
        console.log(this.wrongAnswers);
      }, (err) => {
        console.error(err);
      }
    )    
  }

  sendAnswer() {
    let value = this.formSendAnswer.value;

    value.answer == this.questionAnswer ? (
      this.showCorrectAlert(), 
      this.nextQuestion() 
    ) : this.showIncorrectAlert()
  }

  async showCorrectAlert() {
    const alert = await this.alertController.create({
      header: 'Respuesta correcta!',
      message: 'Veremos si puedes con la siguiente',
      buttons: ['OK']
    })
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async showIncorrectAlert() {
    const random = Math.trunc(Math.random() * this.wrongAnswers.length);
    const alert = await this.alertController.create({
      header: 'Respuesta incorrecta :(',
      message: this.wrongAnswers[random].answer,
      buttons: ['OK']
    })
    await alert.present();
    let result = await alert.onDidDismiss();
  }
  
  async showHelpAlert() {
    const alert = await this.alertController.create({
      header: 'Help hint',
      message: this.helpAnswer,
      buttons: ['OK']
    })
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async showEndAlert() {
    const alert = await this.alertController.create({
      header: 'Enhorabuena',
      message: 'Has completado el juego, de nada por este sueño',
      buttons: ['OK']
    })
    await alert.present();
    let result = await alert.onDidDismiss();
    this.router.navigate(['/home']);
  }

  nextQuestion() {

    this.questionNumber < this.questions.length - 1 
      ? this.questionNumber++
      : this.showEndAlert();

    localStorage.setItem('questionNumber', this.questionNumber)
    this.getQuestions();    
  }

  help() {
    this.showHelpAlert();
  }
}
