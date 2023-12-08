import { Component } from '@angular/core';

@Component({
  selector: 'app-qn-a',
  templateUrl: './qn-a.component.html',
  styleUrl: './qn-a.component.css'
})
export class QnAComponent {
  selectedCategory: string = 'cham-soc';

  showContent(contentId: string): void {
    this.selectedCategory = contentId;
  }

  visibleAnswers: { [key: string]: boolean } = {};

  toggleAnswer(questionId: string): void {
    this.visibleAnswers[questionId] = !this.visibleAnswers[questionId];
  }

  isAnswerVisible(questionId: string): boolean {
    return this.visibleAnswers[questionId] || false;
  }
}
