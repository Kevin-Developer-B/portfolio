import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LanguageService, Lang } from '../language.service';
import { TranslateModule } from '@ngx-translate/core';
import { HoverSlideDirective } from '../shared/hover-slide.directive';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule, HoverSlideDirective],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent implements OnInit {
  currentLang: Lang = 'en';
  isChecked = false;
  policyError = false;
  isInvalid = false;
  mailTest = true;
  normalNamePlaceholder = 'Your_name_goes_here';
  errorNamePlaceholder = 'error_name_message';
  normalEmailPlaceholder = 'youremail@email.com';
  errorEmailPlaceholder = 'error_email_message';
  normalMessagePlaceholder = 'Hello_Lukas,_I_am_interested_in...';
  errorMessagePlaceholder = 'error_message_message';


  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  http = inject(HttpClient)

  contactData = {
    name: "",
    email: "",
    message: "",
  }

  post = {
    endPoint: 'https://deineDomain.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  onSubmit(ngForm: NgForm) {
    console.log(this.contactData);
    
    this.isInvalid =
      ngForm.controls['name']?.invalid ||
      ngForm.controls['email']?.invalid ||
      ngForm.controls['message']?.invalid;

    if (ngForm.invalid) {
      return;
    }

    if (!this.isChecked) {
      return;
    }

    if (ngForm.submitted && ngForm.form.valid && !this.mailTest) {
      this.http.post(this.post.endPoint, this.post.body(this.contactData))
        .subscribe({
          next: (response) => {

            ngForm.resetForm();
          },
          error: (error) => {
            console.error(error);
          },
          complete: () => console.info('send post complete'),
        });
    } else if (ngForm.submitted && ngForm.form.valid && this.mailTest) {

      ngForm.resetForm();
    }
  }

  showPolicyError() {
    if (!this.isChecked) {
      this.policyError = true;
    }
  }

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    this.policyError = false;
  }
}
