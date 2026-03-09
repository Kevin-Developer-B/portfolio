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
  popUpVisible = false;
  popUpClosing = false;
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
    endPoint: 'https://kevin-breiter.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  onSubmit(ngForm: NgForm) {
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

    if (ngForm.valid && this.isChecked) {
      this.http.post(this.post.endPoint, this.contactData).subscribe({
        next: res => {
          ngForm.resetForm();
        },
        error: err => console.error('Fehler:', err)
      });
    }
    this.openPopUp()
    this.checkBoxOut()
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

  checkBoxOut() {
    setTimeout(() => {
      this.isChecked = !this.isChecked;
    }, 1000)
  }

  openPopUp() {
    this.popUpVisible = true;
    this.popUpClosing = false;

    setTimeout(() => {
      this.closePopUp();
    }, 2000);
  }

  closePopUp() {
    this.popUpClosing = true;

    setTimeout(() => {
      this.popUpVisible = false;
      this.popUpClosing = false;
    }, 300);
  }
}
