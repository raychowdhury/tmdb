import { Component,Input, Output, EventEmitter } from '@angular/core';
import {Genre} from "../../../interface/genre";

@Component({
  selector: 'app-movie-filter',
  templateUrl: './movie-filter.component.html',
  styleUrls: ['./movie-filter.component.scss']
})
export class MovieFilterComponent {
  @Input() genres: Genre[] = []; // Genres list received from parent component
  @Output() filterChanged = new EventEmitter<number | null>(); // Emits the selected genre ID

  selectedGenre: number | null = null;

  // Called when user changes the genre filter
  onFilterChange() {
    this.filterChanged.emit(this.selectedGenre);
  }
}
