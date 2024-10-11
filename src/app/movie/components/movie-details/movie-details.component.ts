import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Import Router for navigation
import { MainService } from '../../../services/main.service';
import { Movie } from '../../../interface/movie';
import { MovieCredits } from '../../../interface/movie-credit';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {


  movieId: number = 0;
  movieDetails!: Movie;
  movieCredits!: MovieCredits;
  relatedMovies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MainService,
    private router: Router  // Inject Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.movieId = id !== null ? +id : 0;

    if (this.movieId) {
      this.movieService.getMovieDetails(this.movieId).subscribe((data: Movie) => {
        this.movieDetails = data;
      });

      this.movieService.getMovieCredits(this.movieId).subscribe((data: MovieCredits) => {
        this.movieCredits = data;
      });

      this.movieService.getRelatedMovies(this.movieId).subscribe((data: any) => {
        this.relatedMovies = data.results;
      });
    } else {
      console.error('Invalid movie ID');
    }
  }

  // Method to navigate back to the main page
  goBack() {
    this.router.navigate(['']);  // Change '/movies' to your main movie list route
  }
}
