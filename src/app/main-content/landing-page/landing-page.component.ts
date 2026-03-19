import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { HoverSlideDirective } from '../../services/hover-slide.directive';
import { LanguageService, Lang } from '../../services/language.service';
import { NavbarComponent } from '../../shared/header/navbar/navbar.component';
import { MenuStateService } from '../../services/menu-state-service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavbarComponent, TranslateModule, HoverSlideDirective],
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
  constructor(private languageService: LanguageService, private menuState: MenuStateService) { }

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
}
