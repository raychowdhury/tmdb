import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MovieDefaultComponent} from "./components/movie-default/movie-default.component";
import {MovieListComponent} from "./components/movie-list/movie-list.component";
import {MovieDetailsComponent} from "./components/movie-details/movie-details.component";

const routes: Routes = [
  {
    path: '',
    component: MovieDefaultComponent,
    children: [
      {
        path: '',
        component: MovieListComponent
      },
      {
        path: 'movie-details/:id',
        component: MovieDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovieRoutingModule {
}
