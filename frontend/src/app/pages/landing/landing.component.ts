import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamesService, Game } from '../../services/games.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  featuredGames: Game[] = [];
  currentIndex: number = 0;
  private carouselInterval: any;

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
    this.gamesService.getFeatured().subscribe({
      next: (games) => {
        this.featuredGames = games;
        this.startCarousel();
      },
      error: (err) => console.error('Erro ao buscar jogos em destaque', err)
    });
  }

  get currentGame(): Game | null {
    return this.featuredGames.length > 0 ? this.featuredGames[this.currentIndex] : null;
  }

  startCarousel(): void {
    if (this.featuredGames.length > 0) {
      this.carouselInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.featuredGames.length;
      }, 4500);
    }
  }

  setIndex(index: number): void {
    this.currentIndex = index;
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.startCarousel();
    }
  }

  prevSlide(): void {
    this.setIndex(this.currentIndex > 0 ? this.currentIndex - 1 : this.featuredGames.length - 1);
  }

  nextSlide(): void {
    this.setIndex(this.currentIndex < this.featuredGames.length - 1 ? this.currentIndex + 1 : 0);
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }
}
