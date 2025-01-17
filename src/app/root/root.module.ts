import {NgModule} from '@angular/core';

import {RootRoutingModule} from './root.routing.module';
import {RootDefaultComponent} from './components/root-default/root-default.component';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {MainService} from "../services/main.service";
import {MovieModule} from "../movie/movie.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    RootDefaultComponent
  ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        RootRoutingModule,
        MovieModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [RootDefaultComponent]
})
export class RootModule {
}
