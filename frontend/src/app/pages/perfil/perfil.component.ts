import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: User | null = null;
  
  editMode = false;
  editData = {
    nome: '',
    senha: '',
    confirmarSenha: ''
  };

  message = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.me().subscribe({
      next: (res) => {
        this.user = res.user;
        this.editData.nome = this.user.nome;
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
    this.message = '';
    this.errorMessage = '';
    if (!this.editMode && this.user) {
      this.editData.nome = this.user.nome;
      this.editData.senha = '';
      this.editData.confirmarSenha = '';
    }
  }

  onSave(): void {
    this.message = '';
    this.errorMessage = '';

    if (this.editData.senha && this.editData.senha !== this.editData.confirmarSenha) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    const updates: any = {};
    if (this.editData.nome !== this.user?.nome) {
      updates.nome = this.editData.nome;
    }
    if (this.editData.senha) {
      updates.senha = this.editData.senha;
    }

    if (Object.keys(updates).length === 0) {
      this.toggleEdit();
      return;
    }

    this.authService.updateProfile(updates).subscribe({
      next: (res) => {
        this.message = 'Perfil atualizado com sucesso.';
        if (res.user) {
          this.user = res.user;
        }
        this.editMode = false;
        this.editData.senha = '';
        this.editData.confirmarSenha = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao atualizar perfil.';
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
