import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/model/interfaces';
import { UserService } from 'src/app/services/user.service';

export const passwordMatchValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const password = control.get("password");
  const confirmPassword = control.get("confirmPassword");

  const errors =
    password && confirmPassword && password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  confirmPassword.setErrors(errors);
  return errors;
};

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  registerForm = this.fb.group(
    {
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(5)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(5)]],
    },
    { validators: passwordMatchValidator, updateOn: 'blur' }
  );

  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  ngOnInit(): void {
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.registerForm.valid) {

      const user: User = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value,
        password: this.password.value
      }

      this.userService.registerUser(user).subscribe(registeredUser => {
        this.resetForm(formDirective);
        this.openSnackBar("Registration Successful. You can login now");
        this.router.navigate(['/']);
      }, err => {
        if (err.status === 409) {
          this.router.navigate(['/']);
          this.openSnackBar("User already registered !!! Please login");
        } else {
          this.openSnackBar("Something went wrong.. Please try again later !!!");
        }
      });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  resetForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.registerForm.reset();
  }

  get firstName() {
    return this.registerForm.get("firstName");
  }

  get lastName() {
    return this.registerForm.get("lastName");
  }

  get email() {
    return this.registerForm.get("email");
  }

  get password() {
    return this.registerForm.get("password");
  }

  get confirmPassword() {
    return this.registerForm.get("confirmPassword");
  }

  setNullErrors(formControl: AbstractControl) {
    formControl.setErrors(null);
  }
}
