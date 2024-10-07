import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RootDefaultComponent} from "./components/root-default/root-default.component";


const routes: Routes = [
  {
    path: '',
    component: RootDefaultComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../movie/movie.module').then(m => m.MovieModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RootRoutingModule {
}
