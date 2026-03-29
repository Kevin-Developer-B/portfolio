import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LanguageService, Lang } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollAnimation } from '../../services/scrollAnimation';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss'
})
export class AboutMeComponent implements OnInit, AfterViewInit {
  currentLang: Lang = 'en';

  /**
  * Creates the component and injects the LanguageService.
  */
  constructor(private languageService: LanguageService, private animation: ScrollAnimation) { }

  /**
  * Angular lifecycle hook that is called after the component's view has been fully initialized.
  * Triggers a slide-in animation for the featured projects section.
  */
  ngAfterViewInit() {
    this.animation.splitReveal('.left','.right');
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
}
