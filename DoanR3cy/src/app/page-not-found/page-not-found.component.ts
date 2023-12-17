import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
  <div class="container">
    <h3 class="h3">Không tìm thấy trang này</h3>
    <p class="p">Xin lỗi, chúng tôi không tìm thấy trang này</p>
    <button class="h3 button" routerLink="/main-page" routerLinkActive="active">TRỞ VỀ TRANG CHỦ</button>
    </div>
  `,
  styles: `
  div{
    font-family: Inter-Regular;
}
  .container{
    margin-top: 200px;
    text-align: center;
    min-height: 34vh
  }

  .h3{
    color: var(--color-blue)
  }

  .button {
    background-color: var(--color-blue);
    color: var(--color-white);
    border-radius: 10px;
    border: none;
    padding: 10px 20px;
    /* width: 100px; */
    cursor: pointer;
    font-weight: bold;
}
  `
})
export class PageNotFoundComponent {

}
