import {Component, OnInit} from '@angular/core';
import {MainService} from "../../../services/main.service";

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit{

  constructor(private movieService: MainService ) {}

  movies: any[] = [];

  ngOnInit() {
    this.movieService.getMovies().subscribe((data: any) => {
      this.movies = data.results; // Use the 'results' array from the API response
    });
  }

}
