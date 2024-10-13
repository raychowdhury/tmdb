import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieRoutingModule } from './movie-routing.module';
import { MovieDefaultComponent } from './components/movie-default/movie-default.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import {MainService} from "../services/main.service";
import {HttpClientModule} from "@angular/common/http";

import { MovieWatchListComponent } from './components/movie-watch-list/movie-watch-list.component';
import { MovieHeaderComponent } from './components/movie-header/movie-header.component';

@NgModule({
  declarations: [
    MovieDefaultComponent,
    MovieListComponent,
    MovieDetailsComponent,
    MovieWatchListComponent,
    MovieHeaderComponent
  ],
  imports: [
    CommonModule,
    MovieRoutingModule,
    HttpClientModule
  ],
  exports: [
    MovieHeaderComponent
  ],
  providers: [MainService
  ]
})
export class MovieModule { }
