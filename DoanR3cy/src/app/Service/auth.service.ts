import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { AccountCustomer } from '../Interface/AccountCustomer';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  // login(Mail: string, password: string): Observable<AccountCustomer> {
  //   const url = 'http://localhost:3000/login';
  //   const data = { Mail, password };
  //   return this.http.post<AccountCustomer>(url, data).pipe(
  //     tap(user => console.log('User from server:', user)), 
  //   );
  // }

  saveUserIdToSessionStorage(userid: number): void {
    sessionStorage.setItem('userid', userid.toString());
  }

  login(Mail: string, password: string): Observable<AccountCustomer> {
    const url = 'http://localhost:3000/login';
    const data = { Mail, password };

    return this.http.post<AccountCustomer>(url, data).pipe(
      tap(user => {
        console.log('User from server:', user);
        console.log('user', user.Name);
    
        if (user && user.userid) {
          this.saveUserIdToSessionStorage(user.userid);
          this.setCurrentUser(user);
          console.log('Login successful');
        } else {
          console.error('Login unsuccessful. User or userid is null.');
          // console.log('user:', user);
        }
      }),
    );
    
  }

  // Add a new method to get userid from sessionStorage
  getUserId(): string | null {
    return sessionStorage.getItem('userid');
  }

  getUserIdNumber(): number | null {
    const userIdString = sessionStorage.getItem('userid');
    if (userIdString) {
      const userIdNumber = parseInt(userIdString, 10);
      return userIdNumber;
    } else {
      return null;
    }
  }
  

  logout() {
    sessionStorage.removeItem('CurrentUser');
    // sessionStorage.removeItem('userid');
  }

  // setCurrentUser(user: any) {
  //   sessionStorage.setItem('CurrentUser', JSON.stringify(user));
  // }

  // getCurrentUser() {
  //   return JSON.parse(sessionStorage.getItem('CurrentUser')!);
  // }

  setCurrentUser(user: any) {
    if (user) {
      sessionStorage.setItem('CurrentUser', JSON.stringify(user));
    } else {
      console.error('Trying to set null user.');
    }
  }
  
  getCurrentUser() {
    const userString = sessionStorage.getItem('CurrentUser');
    if (userString) {
      return JSON.parse(userString);
    } else {
      console.error('No user found in sessionStorage.');
      return null; // or handle the absence of user in a way that makes sense for your application
    }
  }
  
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  public setCookie(name: string, value: string, expireDays: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  public getCookie(name: string): string {
    const cookieName = name + '=';
    const cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return "";
  }

  public deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }

  // Lưu email tạm thời từ forgotpass
  temporaryMail: string = '';

  setTemporaryMail(Mail: string): void {
    this.temporaryMail = Mail;
  }

  getTemporaryEmail(): string {
    return this.temporaryMail;
  }

  private apiUrl = 'http://localhost:3000'; // Đặt URL của API của bạn ở đây

  //Hàm gửi yêu cầu cập nhật mật khẩu
  // async updatePassword(Mail: string, newPassword: string): Promise<any> {
  //   const url = `${this.apiUrl}/update-password`;
  //   const data = { Mail, newPassword };
  //   const response = await this.http.put<any>(url, { Mail, newPassword });
  //   return response.message;
  // }

  async updatePassword(Mail: string, newPassword: string): Promise<any> {
    const url = `${this.apiUrl}/update-password`;
    const data = { Mail, newPassword };
  
    try {
      const response = await this.http.put<any>(url, data).toPromise(); // Thêm .toPromise()
  
      // Kiểm tra cấu trúc thực tế của phản hồi
      if (response && response.message) {
        return response.message;
      } else {
        // Điều chỉnh phần này dựa trên cấu trúc thực tế của phản hồi
        return 'Cập nhật mật khẩu thành công'; // Hoặc xử lý khác tùy ý
      }
    } catch (error) {
      // Xử lý lỗi một cách phù hợp
      console.error('Lỗi khi cập nhật mật khẩu:', error);
      throw error; // Ném lại lỗi nếu cần
    }
  }



  
  
  // private apiUrl = 'http://localhost:3000';
  // async changePassword(Mail: string, oldPassword: string, newPassword: string): Promise<string> {
  //   try {
  //     const response = await this.http.put<any>(`/change-password`, { Mail, oldPassword, newPassword }).toPromise();
  //     return response.message;
  //   } catch (error) {
  //     this.handlePasswordChangeError(error);
  //     throw error;
  //   }
  // }

  // resetPassword(mail: string, newPassword: string): Observable<any> {
  //   // Gọi endpoint mới để reset mật khẩu
  //   return this.http.post(`${this.apiUrl}/reset-password`, { mail, newPassword });
  // }

  // private handlePasswordChangeError(error: any): void {
  //   console.error(error);
  //   if (error.status === 401) {
  //     alert(error.error.message);
  //   } else {
  //     alert('An error occurred while changing password. Please try again later.');
  //   }
  // }

  // updatePassword(Mail: string, oldPassword: string, newPassword: string): Observable<any> {
  //   const url = `${this.apiUrl}/update-password`;
  //   const data = { Mail, oldPassword, newPassword };
  
  //   return this.http.put(url, data);
  // }

  // isPasswordValid(password: string): boolean {
  //   // Thêm các điều kiện kiểm tra tính hợp lệ của mật khẩu ở đây
  //   // Ví dụ: ít nhất 6 ký tự, chứa ít nhất một chữ cái và một số.
  //   return /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(password);
  // }

}
