import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  focus: any;
  focus1: any;
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(){
    if(!this.loginForm.valid){
      this.snackBar.open('Form is not valid', 'ok', {
        horizontalPosition: "center",
        verticalPosition: "top",
      });
      return;
    };

    this.authService
      .authenticate(
        this.loginForm.get('user')?.value,
        this.loginForm.get('password')?.value
      )
      .subscribe({
        next: () => this.router.navigate(['home/']),
        error: (err) => console.error(err)
      }
    );
  }
}
