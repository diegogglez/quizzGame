import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
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
  questionTitle: any;
  questionAnswer: any;
  helpAnswer: any;
  questionNumber: any;
  formSendAnswer: FormGroup;

  constructor(private apiService: ApiService, public formBuilder: FormBuilder) { 
    this.formSendAnswer = this.formBuilder.group({
      answer: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.getQuestions();
    this.questionNumber = 0;
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

  sendAnswer() {
    let value = this.formSendAnswer.value;
    console.log(value);
    
  }

}
