import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../../../interface/movie';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  @Input() movie!: Movie; // Movie object to display
  @Input() isInWatchlist: boolean = false; // Whether the movie is in the watchlist

  @Output() addMovie = new EventEmitter<Movie>();
  @Output() removeMovie = new EventEmitter<Movie>();
  @Output() navigateToDetails = new EventEmitter<number>();

  onAddMovie(event: Event) {
    event.stopPropagation();
    this.addMovie.emit(this.movie);
  }

  onRemoveMovie(event: Event) {
    event.stopPropagation();
    this.removeMovie.emit(this.movie);
  }

  onNavigateToDetails() {
    this.navigateToDetails.emit(this.movie.id);
  }
}
