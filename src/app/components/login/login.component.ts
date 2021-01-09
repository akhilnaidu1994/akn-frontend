import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,) { }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  }, { updateOn: 'blur' })

  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  ngOnInit(): void {
    this.email.valueChanges
      .pipe(
        map(value => value.trim()),
        map(value => value.toLowerCase())
      ).subscribe(value => this.email.patchValue(value, { emitEvent: false }));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe(data => {
        this.router.navigate(['/home']);
      }, err => {
        if (err.status === 403) {
          this.openSnackBar("Invalid Credentials !!!");
        } else {
          this.openSnackBar("Something went wrong.. Please try again later !!!");
        }
      });
    }
  }

  setNullErrors(formControl: AbstractControl) {
    formControl.setErrors(null);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

}
