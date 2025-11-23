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
  normalPlaceholder = 'Your_name_goes_here';
  errorPlaceholder = 'Name_is_required!';
  isInvalid = false;

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
    message: "",
  }

  onSubmit(form: NgForm) {
    // Fehler für Name setzen
    this.isInvalid = form.controls['name'].invalid;

    // Wenn das Formular ungültig ist → Abbruch
    if (form.invalid) {
      return;
    }

    // Checkbox prüfen (falls nötig)
    if (!this.isChecked) {
      console.log('Checkbox muss aktiviert sein');
      return;
    }

    // Formular korrekt → Daten verarbeiten
    console.log(this.contactData);
  }



  toggleCheckbox() {
    this.isChecked = !this.isChecked;
  }

}
