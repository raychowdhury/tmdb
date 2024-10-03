import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  moviesByGenre: any = {};
  genres: any[] = [];

  constructor(private movieService: MainService) {}

  ngOnInit() {
    // Fetch genres and movies from the service
    this.movieService.getMovieGenres().subscribe((data: any) => {
      this.genres = data.genres; // Assuming API response contains genres array
      this.movieService.getMovies().subscribe((movieData: any) => {
        const movies = movieData.results; // Assuming movie results are in 'results'
        this.groupMoviesByGenre(movies);
      });
    });
  }

  // Method to group movies by genre
  groupMoviesByGenre(movies: any[]) {
    this.genres.forEach(genre => {
      this.moviesByGenre[genre.name] = movies.filter((movie: any) =>
        movie.genre_ids.includes(genre.id)
      );
    });
    console.log(this.moviesByGenre); // Verify the grouped data
  }
}
