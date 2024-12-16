import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../../services/main.service';
import { Movie } from '../../../interface/movie';
import { Genre } from '../../../interface/genre';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  selectedGenre: string = 'All';
  message: string = '';
  showMessage: boolean = false;

  // Create a Subject to watch changes in the searchTerm
  private searchSubject: Subject<string> = new Subject<string>();

  constructor(private movieService: MainService, private router: Router) {}

  ngOnInit() {
    this.loadWatchlist();
    this.fetchGenresAndMovies();

    // Debounce the search functionality using RxJS
    this.searchSubject
      .pipe(debounceTime(300)) // Wait for 300ms pause in events
      .subscribe(() => {
        this.onSearch();
      });
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

  // Called whenever the search input changes
  onSearchInputChange() {
    this.searchSubject.next(this.searchTerm);
  }

  // Search and filter movies
  onSearch() {
    if (this.searchTerm.trim() === '' && this.selectedGenre === 'All') {
      this.filteredMovies = [];
    } else {
      let allMovies = Object.values(this.moviesByGenre).flat();

      if (this.searchTerm.trim() !== '') {
        allMovies = allMovies.filter((movie) =>
          movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      if (this.selectedGenre !== 'All') {
        allMovies = allMovies.filter((movie) =>
          Object.keys(this.moviesByGenre).some(
            (genreName) =>
              genreName === this.selectedGenre && this.moviesByGenre[genreName].includes(movie)
          )
        );
      }

      const uniqueMovies = new Map<number, Movie>();
      allMovies.forEach((movie) => {
        uniqueMovies.set(movie.id, movie);
      });

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
