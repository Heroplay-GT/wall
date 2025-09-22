// src/app/pages/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone:false,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = null;
    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({
      next: user => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: err => {
        this.loading = false;
        // map errores firebase a mensajes amistosos
        this.error = this.mapAuthError(err);
      }
    });
  }

  mapAuthError(err: any): string {
    const code = err?.code || err?.message || '';
    if (code.includes('wrong-password')) return 'Contraseña incorrecta.';
    if (code.includes('user-not-found')) return 'Usuario no encontrado.';
    if (code.includes('invalid-email')) return 'Email inválido.';
    return 'Error al iniciar sesión. Intenta nuevamente.';
  }
}
