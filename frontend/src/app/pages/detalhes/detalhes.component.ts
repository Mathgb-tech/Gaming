import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GamesService, GameDetails, Screenshot } from '../../services/games.service';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css']
})
export class DetalhesComponent implements OnInit {
  game: GameDetails | null = null;
  isLoading = true;
  hasError = false;

  activeScreenshot: Screenshot | null = null;
  descriptionExpanded = false;

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.gamesService.getGameDetails(id).subscribe({
        next: (data) => {
          this.game = data;
          if (data.screenshots && data.screenshots.length > 0) {
            this.activeScreenshot = data.screenshots[0];
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.hasError = true;
          this.isLoading = false;
        }
      });
    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  selectScreenshot(shot: Screenshot): void {
    this.activeScreenshot = shot;
  }

  getDevelopers(): string {
    if (!this.game?.developers?.length) return 'Desconhecida';
    return this.game.developers.map(d => d.name).join(', ');
  }
}
