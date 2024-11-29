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
  watchlistMovieIds: Set<number> = new Set<number>();
  moviesByGenre: { [key: string]: Movie[] } = {};
  filteredMovies: Movie[] = [];
  genres: Genre[] = [];
  searchTerm: string = '';
  message: string = '';
  showMessage: boolean = false;

  constructor(private movieService: MainService, private router: Router) {}

  ngOnInit() {
    this.loadWatchlist();
    this.fetchGenresAndMovies();
  }

  // Load the watchlist from localStorage
  loadWatchlist() {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    this.watchlistMovieIds = new Set(storedWatchlist.map((movie: any) => movie.id));
  }

  // Fetch genres and their movies
  fetchGenresAndMovies() {
    this.movieService.getMovieGenres().subscribe((data: any) => {
      this.genres = data.genres as Genre[];
      this.genres.forEach((genre) => this.fetchMoviesByGenre(genre.id, genre.name));
    });
  }

  // Fetch movies by genre ID and add them to moviesByGenre list
  fetchMoviesByGenre(genreId: number, genreName: string) {
    this.movieService.getDiscoverGenre(genreId).subscribe((movieData: any) => {
      this.moviesByGenre[genreName] = movieData.results as Movie[];
    });
  }

  // Search movies based on the search term
// Search movies based on the search term and remove duplicates
  onSearch() {
    if (this.searchTerm.trim() === '') {
      // If search term is empty, clear filteredMovies
      this.filteredMovies = [];
    } else {
      // Create a flat list of all movies from all genres
      const allMovies = Object.values(this.moviesByGenre).flat();

      // Filter based on search term and remove duplicates
      const uniqueMovies = new Map<number, Movie>(); // Using a Map to ensure unique movies by their id
      allMovies.forEach((movie) => {
        if (movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())) {
          // Add movie to Map if it matches the search term, keyed by the movie ID
          uniqueMovies.set(movie.id, movie);
        }
      });

      // Convert the Map values to an array for filteredMovies
      this.filteredMovies = Array.from(uniqueMovies.values());
    }
  }


  // Add a movie to the watchlist
  addMovie(movie: Movie) {
    let storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const movieExists = storedWatchlist.some((m: any) => m.id === movie.id);

    if (!movieExists) {
      storedWatchlist.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
      });
      localStorage.setItem('watchlist', JSON.stringify(storedWatchlist));
      this.watchlistMovieIds.add(movie.id);
      this.showTemporaryMessage(`"${movie.title}" has been added to your watchlist.`);
    } else {
      this.showTemporaryMessage(`"${movie.title}" is already in your watchlist.`);
    }
  }

  // Remove a movie from the watchlist
  removeMovie(movie: Movie) {
    let storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const movieIndex = storedWatchlist.findIndex((m: any) => m.id === movie.id);

    if (movieIndex !== -1) {
      storedWatchlist.splice(movieIndex, 1);
      localStorage.setItem('watchlist', JSON.stringify(storedWatchlist));
      this.watchlistMovieIds.delete(movie.id);
      this.showTemporaryMessage(`"${movie.title}" has been removed from your watchlist.`);
    } else {
      this.showTemporaryMessage(`"${movie.title}" is not in your watchlist.`);
    }
  }

  // Show a temporary message
  showTemporaryMessage(message: string) {
    this.message = message;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000); // Show message for 3 seconds
  }

  // Navigate to the movie details page
  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }
}
