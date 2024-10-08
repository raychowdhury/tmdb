

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../../services/main.service';
import { Movie } from '../../../interface/movie';  // Import the Movie interface
import { Genre } from '../../../interface/genre';  // Import the Genre interface


@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  moviesByGenre: { [key: string]: Movie[] } = {};
  genres: Genre[] = [];

  constructor(private movieService: MainService, private router: Router) {}  // Inject Router

  ngOnInit() {
    this.movieService.getMovieGenres().subscribe((data: any) => {
      this.genres = data.genres as Genre[];

      this.genres.forEach((genre) => {
        this.movieService.getDiscoverGenre(genre.id).subscribe((movieData: any) => {
          this.moviesByGenre[genre.name] = movieData.results as Movie[];
        });
      });
    });
  }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);  // Navigate to the Movie Details component
  }
}
