import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '@core/shared/shared.module';
import { FormComponent } from '@core/shared/form/form.component';
import { ComponentsModule } from '@core/components/components.module';

@NgModule({
  declarations: [
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    FormComponent,
    ComponentsModule,
    HomeComponent
  ],
  exports: [
  ]
})
export class PagesModule { }
