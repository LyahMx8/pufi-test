import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from "@env/environment";
import {Menu} from '@core/_models/menu';

@Injectable({providedIn: 'root'})

export class MenuService {

    constructor(private http: HttpClient) {
    }

    menuElements(){
        return this.http.get<Menu[]>(`${environment.apiUrl}menu`);
    }
}