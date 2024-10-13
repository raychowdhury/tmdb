import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-movie-header',
  templateUrl: './movie-header.component.html',
  styleUrls: ['./movie-header.component.scss']
})
export class MovieHeaderComponent {
  isDropdownOpen: boolean = false;  // Controls dropdown visibility

  constructor(private movieService: MainService, private router: Router) {
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;

  }

  watchlist() {
    this.router.navigate(['movie-watch-list']);  // Change '/movies' to your main movie list route
  }

  goBack() {
    this.router.navigate(['']);  // Change '/movies' to your main movie list route
  }
}
