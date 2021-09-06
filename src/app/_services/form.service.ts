import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from "@env/environment";
import {Form} from '@core/_models/form';

@Injectable({providedIn: 'root'})

export class FormService {

    constructor(private http: HttpClient) {
    }

    /**
     * Post the form appening the data in an array
     * @author Yimmy Motta 
     * @param data:array = the data from the form
     * @log data received
     * @return An array or string of the answer from the backend to display to the user
     */
    postContactForm(data) {
        console.log("Contact Form")
        console.log(data)
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('city', data.city);
        formData.append('message', data.message);
        return this.http.post<Form[]>(`${environment.apiUrl}contact`, formData);
    }
}