import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomProduct } from '../Interface/CustomProduct'; // Replace with the actual path

@Injectable({
  providedIn: 'root'
})
export class CustomProductService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  //   postCustom(customData: CustomProduct): Observable<any> {
  //     return this.http.post(`${this.apiUrl}/customProducts`, customData);
  //   }

  postCustom(customData: CustomProduct): Observable<any> {
      const formData = new FormData();
      formData.append('Name', customData.Name);
      formData.append('phonenumber', customData.phonenumber);
      formData.append('Mail', customData.Mail);
      formData.append('pname', customData.pname);
      formData.append('pdes', customData.pdes);
      formData.append('pfile', customData.pfile);

      return this.http.post(`${this.apiUrl}/customProducts`, formData);
    }

}
