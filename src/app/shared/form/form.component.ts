import { Component, OnInit } from '@angular/core';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FormService } from '@core/_services/form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  public userForm: FormGroup
  public error: any
  public loading: boolean = false
  public thankYou: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService
  ) { }

  ngOnInit(): void {
    this.createForm()
  }

  createForm(){
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    });
  }

  submitMessage() {
    this.userForm.disable()
    this.loading = true
    this.formService.postContactForm(this.userForm.value)
      .pipe(first())
      .subscribe((data:any) => {
            this.userForm.reset()
            this.userForm.enable()
            this.loading = false
            this.thankYou = true
        },
        err => {
          if (err.status === 422) {
            this.error = err;
            console.log(this.error)
          } else {
            this.error = err.error.message;
            console.log(this.error)
          }
        });
  }

}
