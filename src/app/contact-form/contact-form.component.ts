import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LanguageService, Lang } from '../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { HoverSlideDirective } from '../services/hover-slide.directive';
import { HttpClient } from '@angular/common/http';
import { ScrollAnimation } from '../services/scrollAnimation';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule, HoverSlideDirective],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent implements OnInit, AfterViewInit {
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
  http = inject(HttpClient)

  /**
  * Creates the component and injects the LanguageService.
  */
  constructor(private languageService: LanguageService, private animation: ScrollAnimation) { }

  /**
  * Angular lifecycle hook that is called after the component's view has been fully initialized.
  * Triggers a slide-in animation for the featured projects section.
  */
  ngAfterViewInit() {
    this.animation.splitReveal('.leftAnimation', '.rightAnimation');
  }

  /**
  * Initializes the current language and subscribes to language changes.
  */
  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  /**
  * Stores the contact form input data.
  */
  contactData = {
    name: "",
    email: "",
    message: "",
  }

  /**
  * Configuration object for the contact form POST request.
  */
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

  /**
  * Handles the form submission process.
  * Validates the form, stops submission if invalid,
  * sends the data, and runs post-submit actions.
  */
  onSubmit(form: NgForm) {
    this.setInvalidState(form);
    if (this.shouldStopSubmit(form)) return;
    this.afterSubmit();
    this.sendForm(form);
  }

  /**
  * Updates the invalid state based on required form controls.
  */
  private setInvalidState(form: NgForm) {
    this.isInvalid =
      form.controls['name']?.invalid ||
      form.controls['email']?.invalid ||
      form.controls['message']?.invalid;
  }

  /**
  * Determines whether form submission should be stopped.
  * Returns true if the form is invalid or the checkbox is unchecked.
  */
  private shouldStopSubmit(form: NgForm): boolean {
    return form.invalid || !this.isChecked;
  }

  /**
  * Sends the form data to the backend endpoint.
  * Resets the form on success and logs errors on failure.
  */
  private sendForm(form: NgForm) {
    this.http.post(this.post.endPoint, this.contactData).subscribe({
      next: () => form.resetForm(),
      error: err => console.error('Fehler:', err)
    });
  }

  /**
  * Executes actions after a successful form submission.
  */
  private afterSubmit() {
    this.openPopUp();
    this.checkBoxOut();
  }

  /**
  * Shows a policy error message if the checkbox is not selected.
  */
  showPolicyError(form?: NgForm) {
    // Placeholder / Fehler aktivieren
    this.isInvalid = true;

    // Felder als touched markieren (für Validierungsanzeigen)
    if (form) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // Checkbox Fehler wie bisher
    if (!this.isChecked) {
      this.policyError = true;
    }
  }

  /**
  * Toggles the policy checkbox state and clears any policy error.
  */
  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    this.policyError = false;
  }

  /**
  * Automatically unchecks the checkbox after a short delay.
  */
  checkBoxOut() {
    setTimeout(() => {
      this.isChecked = !this.isChecked;
    }, 1000)
  }

  /**
  * Displays the success popup and schedules its closing.
  */
  openPopUp() {
    this.popUpVisible = true;
    this.popUpClosing = false;

    setTimeout(() => {
      this.closePopUp();
    }, 2000);
  }

  /**
  * Starts the popup closing animation and hides it afterwards.
  */
  closePopUp() {
    this.popUpClosing = true;

    setTimeout(() => {
      this.popUpVisible = false;
      this.popUpClosing = false;
    }, 300);
  }
}
