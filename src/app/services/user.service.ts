import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RickAndMortyUser {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<{ results: RickAndMortyUser[] }> {
    return this.http.get<{ results: RickAndMortyUser[] }>(this.api);
  }
} 