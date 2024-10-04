import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Genre} from "../interface/genre";

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private apiKey = 'fb969352d414f714f97f3ba2765c07aa';
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  getMovies() {
    return this.http.get(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}`);


  }

  getMovieGenres(): Observable<Genre[]> {
    const url = `${this.apiUrl}/genre/movie/list?language=en&api_key=${this.apiKey}`;
    return this.http.get<Genre[]>(url);

  }


}
