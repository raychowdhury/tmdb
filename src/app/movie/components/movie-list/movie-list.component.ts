import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../../services/main.service';
import { Movie } from '../../../interface/movie';
import { Genre } from '../../../interface/genre';
import { Subject, forkJoin } from 'rxjs';
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

  private searchSubject: Subject<string> = new Subject<string>();

  constructor(private movieService: MainService, private router: Router) {}

  ngOnInit() {
    this.loadWatchlist();
    this.fetchGenresAndMovies();

    // Debounced search input changes
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.applySearchAndFilter();
    });
  }

  // Load watchlist from localStorage
  loadWatchlist() {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    this.watchlistMovieIds = new Set(storedWatchlist.map((movie: any) => movie.id));
  }

  // Fetch genres and movies
  fetchGenresAndMovies() {
    this.movieService.getMovieGenres().subscribe(
      (data: any) => {
        // Include 'All' as the first genre
        this.genres = [{ id: 0, name: 'All' }, ...data.genres] as Genre[];
        console.log('Fetched genres:', this.genres);

        // Prepare an array of observables for fetching movies by genre
        const genreObservables = this.genres
          .filter((genre) => genre.name !== 'All')
          .map((genre) => this.movieService.getDiscoverGenre(genre.id));

        // Use forkJoin to wait for all movie fetches to complete
        forkJoin(genreObservables).subscribe(
          (moviesData: any[]) => {
            moviesData.forEach((movieData, index) => {
              const genreName = this.genres[index + 1].name; // +1 to skip 'All'
              this.moviesByGenre[genreName] = movieData.results as Movie[];
              console.log(`Fetched movies for genre ${genreName}:`, this.moviesByGenre[genreName]);
            });
            this.applySearchAndFilter(); // Apply filters after all movies are fetched
          },
          (error) => {
            console.error('Error fetching movies:', error);
            this.showTemporaryMessage('Failed to load some movies. Please try again later.');
          }
        );
      },
      (error) => {
        console.error('Error fetching genres:', error);
        this.showTemporaryMessage('Failed to load genres. Please try again later.');
      }
    );
  }

  // Search input change triggers the Subject
  onSearchInputChange() {
    this.searchSubject.next(this.searchTerm);
  }

  // Filter change triggers search and filter logic
  onFilterChange() {
    this.applySearchAndFilter();
  }

  // Combines search and filter logic
  applySearchAndFilter() {
    let allMovies: Movie[] = [];

    if (this.selectedGenre === 'All') {
      // Combine all movies from all genres
      allMovies = Object.values(this.moviesByGenre).flat();
    } else {
      // Get movies for the selected genre
      allMovies = this.moviesByGenre[this.selectedGenre] || [];
    }

    console.log(`After genre filter (${this.selectedGenre}):`, allMovies);

    if (this.searchTerm.trim() !== '') {
      // Apply search filter
      allMovies = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      console.log(`After search filter ("${this.searchTerm}"):`, allMovies);
    }

    // Remove duplicates using Map (if necessary)
    const uniqueMovies = new Map<number, Movie>();
    allMovies.forEach((movie) => uniqueMovies.set(movie.id, movie));

    // Set the filtered movies
    this.filteredMovies = Array.from(uniqueMovies.values());
    console.log('Filtered Movies:', this.filteredMovies);
  }

  // Add a movie to the watchlist
  addMovie(movie: Movie) {
    let storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (!storedWatchlist.some((m: any) => m.id === movie.id)) {
      storedWatchlist.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
      });
      localStorage.setItem('watchlist', JSON.stringify(storedWatchlist));
      this.watchlistMovieIds.add(movie.id);
      this.showTemporaryMessage(`"${movie.title}" has been added to your watchlist.`);
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
    }
  }

  // Display a temporary message
  showTemporaryMessage(message: string) {
    this.message = message;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

  // Navigate to movie details
  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }
}
