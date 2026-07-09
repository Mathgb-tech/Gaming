import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(c => c.LandingComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.component').then(c => c.CadastroComponent)
  },
  {
    path: 'catalogo',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/catalogo/catalogo.component').then(c => c.CatalogoComponent)
  },
  {
    path: 'jogos/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/detalhes/detalhes.component').then(c => c.DetalhesComponent)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/perfil/perfil.component').then(c => c.PerfilComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
