// src/app/pages/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false,
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const conf = group.get('confirm')?.value;
    return pass === conf ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.error = null;
    const { email, password } = this.registerForm.value;

    this.auth.register(email, password).subscribe({
      next: user => {
        this.loading = false;
        // opcional: crear documento en Firestore para usuario (más adelante)
        this.router.navigate(['/home']);
      },
      error: err => {
        this.loading = false;
        this.error = this.mapAuthError(err);
      }
    });
  }

  mapAuthError(err: any): string {
    const code = err?.code || err?.message || '';
    if (code.includes('email-already-in-use')) return 'El correo ya está en uso.';
    if (code.includes('invalid-email')) return 'Email inválido.';
    if (code.includes('weak-password')) return 'Contraseña débil. Usa al menos 6 caracteres.';
    return 'Error al registrarse. Intenta nuevamente.';
  }
}
