import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LanguageService, Lang } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss'
})
export class AboutMeComponent implements OnInit {
  currentLang: Lang = 'en';

  /**
  * Creates the component and injects the LanguageService.
  */
  constructor(private languageService: LanguageService) { }

  /**
  * Initializes the current language and subscribes to language changes.
  */
  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }
}
