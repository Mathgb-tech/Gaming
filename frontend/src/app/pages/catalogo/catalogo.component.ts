import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { GamesService, Game, Genre } from '../../services/games.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  genres: Genre[] = [];
  
  isLoading = false;
  hasSearched = false;

  searchTerm = '';
  selectedGenre = '';
  selectedOrdering = '';

  private searchSubject = new BehaviorSubject<string>('');
  private genreSubject = new BehaviorSubject<string>('');
  private orderSubject = new BehaviorSubject<string>('');

  private filterSubscription?: Subscription;

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
    this.gamesService.getGenres().subscribe({
      next: (genres) => this.genres = genres,
      error: (err) => console.error('Erro ao buscar generos', err)
    });

    const searchStream = this.searchSubject.pipe(
      map(term => term.trim()),
      debounceTime(400),
      distinctUntilChanged()
    );

    this.filterSubscription = combineLatest([
      searchStream,
      this.genreSubject.pipe(distinctUntilChanged()),
      this.orderSubject.pipe(distinctUntilChanged())
    ]).pipe(
      switchMap(([nome, genero, ordenar]) => {
        this.isLoading = true;
        this.hasSearched = true;
        return this.gamesService.getCatalog({ nome, genero, ordenar, pagina: 1 });
      })
    ).subscribe({
      next: (res) => {
        this.games = res.results;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar catalogo', err);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  onGenreChange(genre: string): void {
    this.genreSubject.next(genre);
  }

  onOrderChange(order: string): void {
    this.orderSubject.next(order);
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }
}
