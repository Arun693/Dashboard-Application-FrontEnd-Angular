import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { auth } from '../model'
import { CommonServiceService } from '../common-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  authObj!: auth;
  errorMesage!: string;
  version!: string;
  constructor(private formBuilder: FormBuilder,
              private commonService: CommonServiceService,
              private router: Router) { }

  ngOnInit() {
    this.version = environment.version;
    this.loginForm = this.formBuilder.group({
      ppc: ['', Validators.compose([Validators.required, Validators.minLength(3),
                    Validators.maxLength(6)])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  login() {
    if(this.loginForm.value && this.loginForm.value.ppc && this.loginForm.value.password) {
         this.errorMesage = '';
         this.authObj = {
           "ppc" : this.loginForm.value.ppc,
           "password" : btoa(this.loginForm.value.password)
         } 
        this.commonService.startOrStopLoader(true);
        this.commonService.authenticate(this.authObj).subscribe(
          data => {
            this.commonService.startOrStopLoader(false);
            if (data && !data.isPasswordChanged) {
              this.router.navigate(['/resetPassword'])
            } else
            this.router.navigate(['/home']);
          },
          err => {
            this.commonService.startOrStopLoader(false);
            this.loginForm.patchValue({ppc: '',password: ''});
            if(err && err.error && err.error.error) {
              this.errorMesage = err.error.error;
            }
          }
        )
    }
  }

}
