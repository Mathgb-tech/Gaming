import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  // Outros campos da RAWG que precisarmos depois
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface CatalogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

export interface Platform {
  platform: {
    id: number;
    name: string;
  };
}

export interface Developer {
  id: number;
  name: string;
}

export interface Screenshot {
  id: number;
  image: string;
}

export interface GameDetails extends Game {
  description_raw: string;
  genres: Genre[];
  platforms: Platform[];
  developers: Developer[];
  screenshots: Screenshot[];
}

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private apiUrl: string = `${environment.apiUrl}/games`;

  constructor(private http: HttpClient) {}

  getFeatured(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/featured`);
  }

  getPopular(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/popular`);
  }

  search(query: string): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.apiUrl}/genres`);
  }

  getCatalog(filters: { nome?: string; genero?: string; ordenar?: string; pagina?: number }): Observable<CatalogResponse> {
    let params: any = {};
    if (filters.nome) params.nome = filters.nome;
    if (filters.genero) params.genero = filters.genero;
    if (filters.ordenar) params.ordenar = filters.ordenar;
    if (filters.pagina) params.pagina = filters.pagina;

    return this.http.get<CatalogResponse>(`${this.apiUrl}/catalog`, { params });
  }

  getGameDetails(id: string): Observable<GameDetails> {
    return this.http.get<GameDetails>(`${this.apiUrl}/${id}`);
  }
}
