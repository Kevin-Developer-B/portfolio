import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, Lang } from '../../services/language.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  currentLang: Lang = 'en';

  /**
  * Creates an instance of the component and injects the LanguageService.
  * @param languageService Service used to get and observe the current language.
  */
  constructor(private languageService: LanguageService) { }

  /**
  * Initializes the component and subscribes to language changes.
  */
  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  /**
  * Smoothly scrolls the page to the element with the given ID.
  *
  * @param id - The ID of the target element to scroll into view.
  */
  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
  * Smoothly scrolls the page to the top.
  */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
