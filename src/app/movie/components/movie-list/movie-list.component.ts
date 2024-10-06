import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { Movie } from '../../../interface/movie';  // Import the Movie interface
import { Genre } from '../../../interface/genre';  // Import the Genre interface

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  moviesByGenre: { [key: string]: Movie[] } = {};  // Use Movie interface for moviesByGenre
  genres: Genre[] = [];  // Use Genre interface for genres

  constructor(private movieService: MainService) {}

  ngOnInit() {
    this.movieService.getMovieGenres().subscribe((data: any) => {
      this.genres = data.genres as Genre[];  // Cast genres to Genre[]

      this.genres.forEach((genre) => {
        this.movieService.getDiscoverGenre(genre.id).subscribe((movieData: any) => {
          this.moviesByGenre[genre.name] = movieData.results as Movie[];  // Cast movieData to Movie[]
        });
      });
    });
  }
}
