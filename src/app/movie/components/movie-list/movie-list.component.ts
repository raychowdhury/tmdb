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
  watchlist: { id: number, title: string ,imgpath:string }[] = [];
  message: string = '';       // The message to display
  showMessage: boolean = false; // Controls the visibility of the message


  constructor(private movieService: MainService, private router: Router) {}  // Inject MainService and Router

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
  addMovies(event: Event, movieId: number, movieTitle: string, poster_path: string) {
    event.stopPropagation();

    let storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

    const movieExists = storedWatchlist.some((movie: any) => movie.id === movieId);

    if (!movieExists) {
      storedWatchlist.push({ id: movieId, title: movieTitle, poster_path: poster_path });
      localStorage.setItem('watchlist', JSON.stringify(storedWatchlist));
      console.log(`Added to watchlist: ${movieTitle}`);

      this.message = `"${movieTitle}" has been added to your watchlist.`;
    } else {
      console.log(`Movie already in watchlist: ${movieTitle}`);

      this.message = `"${movieTitle}" is already in your watchlist.`;
    }

    this.showMessage = true; // Show the message

    // Hide the message after 3 seconds
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }


  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }

}
