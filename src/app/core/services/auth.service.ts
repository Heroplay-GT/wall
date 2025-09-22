
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private auth: Auth) {}

  register(email: string, password: string): Observable<User | null> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map(credential => credential.user),
      catchError(err => { throw err; })
    );
  }

  login(email: string, password: string): Observable<User | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(credential => credential.user),
      catchError(err => { throw err; })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  currentUser(): Observable<User | null> {
    return new Observable(observer => {
      const unsub = this.auth.onAuthStateChanged(user => observer.next(user), err => observer.error(err));
      return { unsubscribe: unsub };
    });
  }
}
