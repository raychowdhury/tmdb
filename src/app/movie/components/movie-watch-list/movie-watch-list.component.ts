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

  constructor(private router: Router) {}

  ngOnInit() {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    this.watchlist = storedWatchlist;
  }

  removeMovie(movieId: number) {
    this.watchlist = this.watchlist.filter(movie => movie.id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
  }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }
}
