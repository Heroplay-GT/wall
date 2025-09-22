// src/app/pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  template: `
    <div class="home">
      <h2>Bienvenido</h2>
      <p *ngIf="userEmail">Logueado como: {{ userEmail }}</p>
      <button (click)="logout()">Cerrar sesión</button>
    </div>
  `
})
export class HomeComponent implements OnInit {
  userEmail: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser().subscribe(u => this.userEmail = u?.email ?? null);
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
