import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { HoverSlideDirective } from '../../services/hover-slide.directive';
import { LanguageService, Lang } from '../../services/language.service';
import { NavbarComponent } from '../../shared/header/navbar/navbar.component';
import { MenuStateService } from '../../services/menu-state-service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavbarComponent, TranslateModule, HoverSlideDirective, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})

export class LandingPageComponent {
  currentLang: Lang = 'en';
  slides = ['remote', 'fontend_developer', 'based', 'work'];
  isOverlayOpen$ = this.menuState.state$();

  /**
  * Creates the component instance and injects required services.
  * @param languageService Service used to manage and observe the current language.
  * @param menuState Service used to control the menu state.
  */
  constructor(private languageService: LanguageService, private menuState: MenuStateService, private router: Router ) { }

  /**
  * Initializes the component.
  * Sets the current language and subscribes to language changes.
  */
  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  /**
  * Opens the menu by triggering the menu state service.
  */
  stopArrow() {
    this.menuState.open();
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
