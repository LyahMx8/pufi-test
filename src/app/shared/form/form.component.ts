import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '@core/_services/form.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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

  createForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/), Validators.minLength(10), Validators.maxLength(500)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[1-9]\d{1,10}$/), Validators.minLength(7), Validators.maxLength(10)]],
      city: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/), Validators.minLength(2), Validators.maxLength(50)]],
      message: ['', [Validators.required, Validators.pattern(/^[A-Za-z][1-9]+$/), Validators.minLength(2), Validators.maxLength(500)]]
    });
  }

  submitMessage() {
    this.userForm.disable()
    this.loading = true
    var random = Math.floor(Math.random() * 10)
    console.log(this.userForm.value.email.toLowerCase() + random)
    this.formService.postContactForm(this.userForm.value)
      .pipe(first())
      .subscribe((data: any) => {
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
