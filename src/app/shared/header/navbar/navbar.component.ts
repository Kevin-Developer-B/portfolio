import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  currentLang: 'en' | 'de' = 'en';

  switchLanguage(lang: 'en' | 'de') {
    if (lang !== this.currentLang) {
      this.currentLang = lang;
    }
  }
}
