import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LanguageService, Lang } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { HoverSlideDirective } from '../../services/hover-slide.directive';
import { RouterLink, Router } from '@angular/router';
import { ScrollAnimation } from '../../services/scrollAnimation';

@Component({
  selector: 'app-skill-set',
  standalone: true,
  imports: [CommonModule, TranslateModule, HoverSlideDirective, RouterLink],
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
  constructor(private languageService: LanguageService, private router: Router, private animation: ScrollAnimation) { }

  /**
  * Angular lifecycle hook that is called after the component's view has been fully initialized.
  * Triggers a slide-in animation for the featured projects section.
  */
  ngAfterViewInit() {
    this.animation.slideInFromBottom('.skill-set-box');
    this.animation.slideInFromBottom('.skill-images-container');
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

  /**
  * Navigates to the root route and then smoothly scrolls to a section
  * after a short delay.
  *
  * @param section - The ID of the target section to scroll into view.
  */
  scrollTo(section: string) {
    this.router.navigate(['/']);

    setTimeout(() => {
      document.getElementById(section)
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }
}
