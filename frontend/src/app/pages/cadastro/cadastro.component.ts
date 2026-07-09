import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  user = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    aceite_lgpd: false
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.user.aceite_lgpd) {
      this.errorMessage = 'O aceite da LGPD é obrigatório.';
      return;
    }

    if (this.user.senha !== this.user.confirmarSenha) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao realizar cadastro.';
      }
    });
  }
}
