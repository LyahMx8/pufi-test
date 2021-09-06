import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '@core/shared/shared.module';
import { ComponentsModule } from '@core/components/components.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ComponentsModule
  ],
  exports: [
  ]
})
export class PagesModule { }
