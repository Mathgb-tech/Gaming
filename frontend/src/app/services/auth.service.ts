import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  nome: string;
  email: string;
  aceite_lgpd: boolean;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = `${environment.apiUrl}/auth`;
  private usersUrl: string = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data, { withCredentials: true });
  }

  login(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data, { withCredentials: true });
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  me(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  updateProfile(data: any): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.usersUrl}/profile`, data, { withCredentials: true });
  }
}
