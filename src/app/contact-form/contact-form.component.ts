import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LanguageService, Lang } from '../language.service';
import { TranslateModule } from '@ngx-translate/core';
import { HoverSlideDirective } from '../shared/hover-slide.directive';

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
  normalNamePlaceholder = 'Your_name_goes_here';
  errorNamePlaceholder = 'error_name_message';
  normalEmailPlaceholder = 'youremail@email.com';
  errorEmailPlaceholder = 'error_email_message';
  normalMassagePlaceholder = 'How_can_I_help_you';
  errorMassagePlaceholder = 'error_message_message';


  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  contactData = {
    name: "",
    email: "",
    massage: "",
  }

  onSubmit(form: NgForm) {
    this.isInvalid =
      form.controls['name']?.invalid ||
      form.controls['email']?.invalid ||
      form.controls['massage']?.invalid;

    if (form.invalid) {
      return;
    }

    if (!this.isChecked) {
      return;
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
