import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, map } from 'rxjs/operators';
import { GamesService, Game } from '../../services/games.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Destaques (Carousel)
  featuredGames: Game[] = [];
  currentIndex: number = 0;
  private carouselInterval: any;

  // Populares
  popularGames: Game[] = [];

  // Busca
  searchTerm: string = '';
  searchResults: Game[] = [];
  isSearching: boolean = false;
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | undefined;

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
    // Busca destaques para o carousel
    this.gamesService.getFeatured().subscribe({
      next: (games) => {
        this.featuredGames = games;
        this.startCarousel();
      },
      error: (err) => console.error('Erro ao buscar destaques', err)
    });

    // Busca populares
    this.gamesService.getPopular().subscribe({
      next: (games) => this.popularGames = games,
      error: (err) => console.error('Erro ao buscar populares', err)
    });

    // Configuração do RxJS para busca
    this.searchSubscription = this.searchSubject.pipe(
      map(term => term.trim()),
      debounceTime(400),
      distinctUntilChanged(),
      filter(term => {
        if (term.length < 2) {
          this.searchResults = [];
          this.isSearching = false;
          return false;
        }
        this.isSearching = true;
        return true;
      }),
      switchMap(term => this.gamesService.search(term))
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Erro na busca', err);
        this.isSearching = false;
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  // Lógica do Carousel (similar à Landing)
  startCarousel(): void {
    if (this.featuredGames.length > 0) {
      this.carouselInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.featuredGames.length;
      }, 3000);
    }
  }

  setIndex(index: number): void {
    this.currentIndex = index;
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.startCarousel();
    }
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) clearInterval(this.carouselInterval);
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
  }
}
