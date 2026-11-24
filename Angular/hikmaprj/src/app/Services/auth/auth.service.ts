import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, map, Observable, tap, catchError, throwError } from 'rxjs';
import { AuthResponse, LoginInput, LogoutResponse, AppUser, AuthError } from '../../Types/auth.types';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      appUser {
        id
        username
        email
        roles {
          id
          name
        }
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token'; // Changed to match GraphQLModule
  private readonly USER_KEY = 'auth_user';
  private readonly USERNAME_KEY = 'username'; // Added to match GraphQLModule

  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apollo: Apollo) {
    this.loadUserFromStorage();
  }

  private get isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && window.localStorage !== undefined;
    } catch (e) {
      return false;
    }
  }

  private loadUserFromStorage(): void {
    if (!this.isLocalStorageAvailable) return;

    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        // Also store username separately for GraphQL context
        localStorage.setItem(this.USERNAME_KEY, user.username);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
        this.clearSession();
      }
    }
  }

  login(credentials: LoginInput): Observable<AuthResponse> {
    return this.apollo.mutate<{ login: AuthResponse }>({
      mutation: LOGIN_MUTATION,
      variables: {
        input: credentials
      }
    }).pipe(
      map(result => {
        if (!result.data?.login) {
          throw new Error('Login failed');
        }
        return result.data.login;
      }),
      tap(authResponse => {
        this.setSession(authResponse);
      }),
      catchError(error => {
        // Extract GraphQL errors
        const graphQLErrors = error.graphQLErrors;
        let errorMessage = 'Account is deactivated. Please contact administrator.';
        
        if (graphQLErrors && graphQLErrors.length > 0) {
          const firstError = graphQLErrors[0];
          // Use the original error message from the backend
          errorMessage = firstError.message;
          
          // Check if the error message contains specific keywords
          if (errorMessage.includes('deactivated')) {
            return throwError(() => ({
              message: 'Account is deactivated. Please contact administrator.',
              code: 'ACCOUNT_DEACTIVATED'
            }));
          }
        }
        
        return throwError(() => ({
          message: errorMessage,
          code: 'AUTH_ERROR'
        }));
      })
    );
  }

  logout(): Observable<LogoutResponse> {
    return this.apollo.mutate<{ logout: LogoutResponse }>({
      mutation: LOGOUT_MUTATION
    }).pipe(
      map(result => {
        if (!result.data?.logout) {
          throw new Error('Logout failed');
        }
        return result.data.logout;
      }),
      tap(response => {
        if (response.success) {
          this.clearSession();
        }
      })
    );
  }

  private setSession(authResult: AuthResponse): void {
    if (this.isLocalStorageAvailable) {
      localStorage.setItem(this.TOKEN_KEY, authResult.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.appUser));
      localStorage.setItem(this.USERNAME_KEY, authResult.appUser.username);
    }
    this.currentUserSubject.next(authResult.appUser);
    this.isAuthenticatedSubject.next(true);
  }

  private clearSession(): void {
    if (this.isLocalStorageAvailable) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.USERNAME_KEY);
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Clear Apollo cache
    this.apollo.client.resetStore();
  }

  getToken(): string | null {
    if (!this.isLocalStorageAvailable) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.roles?.some(r => r.name === role) ?? false;
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isPlanner(): boolean {
    return this.hasRole('ROLE_PLANNING');
  }

  getUsername(): string | null {
    return this.getCurrentUser()?.username || null;
  }
}