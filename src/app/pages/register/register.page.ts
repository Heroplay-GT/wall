import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth';
import { Query } from 'src/app/core/services/query';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private query: Query,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color
    });
    await toast.present();
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.showToast('Completa todos los campos', 'warning');
      return;
    }

    const { email, password, name, lastname } = this.registerForm.value;

    try {
      const res: any = await this.auth.register(email, password);

      if (res?.user) {
        const userData = {
          name,
          lastName: lastname,
          email,
          uid: res.user.uid
        };

        await this.query.create('users', userData);

        await this.showToast('Registro exitoso 🎉', 'success');

        
        this.router.navigate(['/login']);
      } else {
        this.errorMsg = 'No se pudo obtener el usuario registrado.';
        await this.showToast(this.errorMsg, 'danger');
      }
    } catch (err: any) {
      this.errorMsg = err.message;
      await this.showToast(this.errorMsg, 'danger');
    }
  }
}
