import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-movie-default',
  templateUrl: './movie-default.component.html',
  styleUrls: ['./movie-default.component.scss']
})
export class MovieDefaultComponent {
  showScrollTopButton = false;

  constructor() {}

  // Listen for window scroll events
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // If the user scrolls down 200px from the top, show the button
    this.showScrollTopButton = window.scrollY > 200;
  }

  // Function to scroll the user to the top
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
