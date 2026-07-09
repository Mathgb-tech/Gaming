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

  startCarousel(): void {
    if (this.featuredGames.length > 0) {
      this.carouselInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.featuredGames.length;
      }, 3000); // Muda a cada 3 segundos
    }
  }

  setIndex(index: number): void {
    this.currentIndex = index;
    // Reseta o timer ao interagir
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.startCarousel();
    }
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }
}
