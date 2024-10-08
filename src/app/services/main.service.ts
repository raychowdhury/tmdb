import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Genre } from "../interface/genre";
import { MovieCredits } from '../interface/movie-credit';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private apiKey = 'fb969352d414f714f97f3ba2765c07aa';  // Your TMDb API key
  private apiUrl = 'https://api.themoviedb.org/3';  // Base URL for TMDb API

  constructor(private http: HttpClient) {}

  // Fetch list of movie genres
  getMovieGenres(): Observable<Genre[]> {
    const url = `${this.apiUrl}/genre/movie/list?language=en&api_key=${this.apiKey}`;
    return this.http.get<Genre[]>(url);
  }

  // Fetch movies by genre
  getDiscoverGenre(genreId: number): Observable<any> {
    const url = `${this.apiUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}&api_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  // Fetch details of a specific movie
  getMovieDetails(movieId: number): Observable<any> {
    const url = `${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}&language=en-US`;
    return this.http.get<any>(url);
  }

  // Fetch credits (cast and crew) for a specific movie
  getMovieCredits(movieId: number): Observable<MovieCredits> {
    const url = `${this.apiUrl}/movie/${movieId}/credits?api_key=${this.apiKey}&language=en-US`;
    return this.http.get<MovieCredits>(url);  // Use MovieCredits interface here
  }

  // Fetch related or recommended movies for a specific movie
  getRelatedMovies(movieId: number): Observable<any> {
    const url = `${this.apiUrl}/movie/${movieId}/recommendations?api_key=${this.apiKey}&language=en-US`;
    return this.http.get<any>(url);
  }
}
