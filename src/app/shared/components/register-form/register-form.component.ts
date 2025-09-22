import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  standalone: false,
})
export class RegisterFormComponent {
  email = '';
  password = '';

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  async onRegister() {
    try {
      await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (err: any) {
      alert(err.message);
    }
  }
}
