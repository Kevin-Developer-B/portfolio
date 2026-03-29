import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LanguageService, Lang } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { HoverSlideDirective } from '../../services/hover-slide.directive';
import { ScrollAnimation } from '../../services/scrollAnimation';

@Component({
  selector: 'app-skill-set',
  standalone: true,
  imports: [CommonModule, TranslateModule, HoverSlideDirective],
  templateUrl: './skill-set.component.html',
  styleUrl: './skill-set.component.scss'
})
export class SkillSetComponent implements OnInit, AfterViewInit {
  showInterrest = false;
  currentLang: Lang = 'en';

  /**
  * Creates an instance of the component and injects the LanguageService.
  * @param languageService Service used to get and observe the current language.
  */
  constructor(private languageService: LanguageService, private animation: ScrollAnimation) { }

  /**
  * Angular lifecycle hook that is called after the component's view has been fully initialized.
  * Triggers a slide-in animation for the featured projects section.
  */
  ngAfterViewInit() {
    this.animation.slideInFromBottom('.skill-set-box');
  }

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
  * Shows the interest indicator when the mouse enters the element.
  */
  onMouseEnter() {
    this.showInterrest = true;
  }

  /**
  * Hides the interest indicator when the mouse leaves the element.
  */
  onMouseLeave() {
    this.showInterrest = false;
  }

}
