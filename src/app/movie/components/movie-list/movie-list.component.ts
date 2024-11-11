import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../../services/main.service';
import { Movie } from '../../../interface/movie';
import { Genre } from '../../../interface/genre';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit {
  // Set of movie IDs in the watchlist for quick lookup
  watchlistMovieIds: Set<number> = new Set<number>();

  // Holds movies grouped by genre
  moviesByGenre: { [key: string]: Movie[] } = {};

  // List of genres
  genres: Genre[] = [];

  // Message variables
  message: string = '';
  showMessage: boolean = false;

  constructor(private movieService: MainService, private router: Router) {}

  ngOnInit() {
    this.loadWatchlist(); // Load watchlist IDs from localStorage
    this.fetchGenresAndMovies(); // Fetch genres and movies
  }

  // Load the watchlist from localStorage and populate the set of movie IDs
  loadWatchlist() {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    this.watchlistMovieIds = new Set(storedWatchlist.map((movie: any) => movie.id));
  }

  // Fetch movie genres and their movies
  fetchGenresAndMovies() {
    this.movieService.getMovieGenres().subscribe(
      (data: any) => {
        this.genres = data.genres as Genre[];
        this.genres.forEach((genre) => this.fetchMoviesByGenre(genre.id, genre.name));
      },
      (error) => {
        console.error('Error fetching genres:', error);
      }
    );
  }

  // Fetch movies by genre ID and map them to their genre name
  fetchMoviesByGenre(genreId: number, genreName: string) {
    this.movieService.getDiscoverGenre(genreId).subscribe(
      (movieData: any) => {
        this.moviesByGenre[genreName] = movieData.results as Movie[];
      },
      (error) => {
        console.error(`Error fetching movies for genre ${genreName}:`, error);
      }
    );
  }

  // Add a movie to the watchlist
  addMovie(event: Event, movie: Movie) {
    event.stopPropagation();

    try {
      let storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

      const movieExists = storedWatchlist.some((m: any) => m.id === movie.id);

      if (!movieExists) {
        storedWatchlist.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        });
        localStorage.setItem('watchlist', JSON.stringify(storedWatchlist));
        this.watchlistMovieIds.add(movie.id); // Update the set of watchlist IDs

        this.message = `"${movie.title}" has been added to your watchlist.`;
      } else {
        this.message = `"${movie.title}" is already in your watchlist.`;
      }

      this.showTemporaryMessage();
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
    }
  }

  // Remove a movie from the watchlist
  removeMovie(event: Event, movie: Movie) {
    event.stopPropagation();

    try {
      let storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

      const movieIndex = storedWatchlist.findIndex((m: any) => m.id === movie.id);

      if (movieIndex !== -1) {
        // Remove the movie from the watchlist
        storedWatchlist.splice(movieIndex, 1);
        localStorage.setItem('watchlist', JSON.stringify(storedWatchlist));
        this.watchlistMovieIds.delete(movie.id); // Update the set of watchlist IDs

        this.message = `"${movie.title}" has been removed from your watchlist.`;
      } else {
        this.message = `"${movie.title}" is not in your watchlist.`;
      }

      this.showTemporaryMessage();
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
    }
  }

  // Show a temporary message for 3 seconds
  showTemporaryMessage() {
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

  // Navigate to the movie details page
  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }
}
