import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Form } from '@core/_models/form';

@Injectable({ providedIn: 'root' })

export class FormService {

  constructor(private http: HttpClient) {}

  postContactForm(data) {
    console.log("Contact Form")
    console.log(data)
    const formData = new FormData();
    formData.append('email', data.email);
    return this.http.post<Form[]>(`contact`, formData);
  }
}
