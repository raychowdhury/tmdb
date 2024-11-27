import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../interface/movie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-watch-list',
  templateUrl: './movie-watch-list.component.html',
  styleUrls: ['./movie-watch-list.component.scss']
})
export class MovieWatchListComponent implements OnInit {
  watchlist: Movie[] = [];
  message: string = '';
  showMessage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    this.watchlist = storedWatchlist;
  }

  removeMovie(movie: Movie) {
    this.watchlist = this.watchlist.filter(m => m.id !== movie.id);
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    this.showTemporaryMessage(`"${movie.title}" has been removed from your watchlist.`);
  }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }

  showTemporaryMessage(message: string) {
    this.message = message;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000); // Show message for 3 seconds
  }
}
