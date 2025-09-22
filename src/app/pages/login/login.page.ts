import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    if (!this.loginForm.valid) return;

    const { email, password } = this.loginForm.value;
    try {
      const res = await this.auth.login(email, password);
      if (res) {
        this.router.navigate(['/home']);
      } else {
        this.errorMsg = 'Usuario o contraseña incorrectos';
      }
    } catch (err: any) {
      this.errorMsg = err.message || 'Error al iniciar sesión';
    }
  }
}
