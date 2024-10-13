import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../../services/main.service';
import { Movie } from '../../../interface/movie';  // Import the Movie interface
import { Genre } from '../../../interface/genre';  // Import the Genre interface

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  moviesByGenre: { [key: string]: Movie[] } = {};  // Holds movies grouped by genre
  genres: Genre[] = [];  // List of genres
  movieCount: number = 0;
  watchlist: { id: number, title: string }[] = [];
  isDropdownOpen: boolean = false;  // Controls dropdown visibility


  constructor(private movieService: MainService, private router: Router) {
  }  // Inject MainService and Router

  ngOnInit() {
    this.fetchGenresAndMovies();  // Fetch genres and their associated movies on initialization
  }

  // Fetch movie genres and their movies
  fetchGenresAndMovies() {
    this.movieService.getMovieGenres().subscribe((data: any) => {
      this.genres = data.genres as Genre[];
      this.genres.forEach(genre => this.fetchMoviesByGenre(genre.id, genre.name));
    });
  }

  // Fetch movies by genre ID and map them to their genre name
  fetchMoviesByGenre(genreId: number, genreName: string) {
    this.movieService.getDiscoverGenre(genreId).subscribe((movieData: any) => {
      this.moviesByGenre[genreName] = movieData.results as Movie[];
    });
  }
  addMovies(event: Event, movieId: number, movieTitle: string) {
    event.stopPropagation();  // Prevents bubbling up of the click event
    this.movieCount++;

    // Check if the movie is already in the watchlist
    const movieExists = this.watchlist.some(movie => movie.id === movieId);

    if (!movieExists) {
      // Add movie to watchlist if not already added
      this.watchlist.push({id: movieId, title: movieTitle});
    }
  }
  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }

  // Handle clicks to add movies to the watchlist
  watchfullist() {
    this.router.navigate(['movie-watch-list']);  // Change '/movies' to your main movie list route
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
