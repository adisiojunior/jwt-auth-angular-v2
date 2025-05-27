import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, of } from 'rxjs';
import { AuthResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:5001/api/auth';
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.userSubject.next(JSON.parse(userStr));
    }
  }

  // LOGIN FAKE PARA TESTE
  login(username: string, password: string): Observable<AuthResponse> {
    // Simula um login bem-sucedido e retorna um token fake
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZW1haWwuY29tIiwicm9sZSI6ImFkbWluIn0.' +
      'fake-signature';
    const response: AuthResponse = {
      accessToken: fakeToken,
      refreshToken: 'fake-refresh-token',
      expiresIn: 3600
    };
    return of(response).pipe(
      tap(res => {
        this.setTokens(res);
        this.decodeAndStoreUser(res.accessToken);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    // Simula refresh token
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZW1haWwuY29tIiwicm9sZSI6ImFkbWluIn0.' +
      'fake-signature';
    const response: AuthResponse = {
      accessToken: fakeToken,
      refreshToken: 'fake-refresh-token',
      expiresIn: 3600
    };
    return of(response).pipe(
      tap(res => {
        this.setTokens(res);
        this.decodeAndStoreUser(res.accessToken);
      })
    );
  }

  private setTokens(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, 
      (Date.now() + response.expiresIn * 1000).toString());
  }

  private decodeAndStoreUser(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        id: payload.sub,
        username: payload.username,
        email: payload.email,
        role: payload.role
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) return false;
    
    return Date.now() < parseInt(expiry);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
}
