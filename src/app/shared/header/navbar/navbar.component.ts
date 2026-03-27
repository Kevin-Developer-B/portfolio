import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LanguageService, Lang } from '../../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { MenuStateService } from '../../../services/menu-state-service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentLang: Lang = 'en';
  activeIndex: number | null = null;
  isMenuOpen = false;

  /**
  * Creates an instance of the component and injects the LanguageService.
  * @param languageService Service used to get and observe the current language.
  */
  constructor(private languageService: LanguageService, private menuState: MenuStateService, private router: Router) { }

  /**
  * Initializes component and subscribes to language changes.
  */
  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  /**
  * Toggles between English and German languages.
  */
  toggleLanguage(): void {
    const newLang: Lang = this.currentLang === 'en' ? 'de' : 'en';
    this.languageService.setLanguage(newLang);
  }

  /**
  * Switches language to the specified one.
  * @param lang - Target language ('en' or 'de')
  */
  switchLang(lang: Lang) {
    this.languageService.setLanguage(lang);
  }

  /**
  * Sets language if different from current and triggers toggle.
  * @param lang - Target language ('en' | 'de')
  */
  setLanguage(lang: 'en' | 'de') {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      this.toggleLanguage();
    }
  }

  /**
  * Marks the given index as active.
  * @param idx - Index to set as active
  */
  currentActive(idx: number): void {
    this.activeIndex = idx;
  }

  /**
  * Handles navigation click: prevents default, sets active, closes menu, and scrolls to target element smoothly.
  * @param event - The click event
  * @param targetId - The ID of the element to scroll to
  * @param index - The index to mark as active
  */
  onNavClick(event: Event, targetId: string, index: number) {
    event.preventDefault();
    this.currentActive(index);
    this.closeMenu();
    setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }

  /**
  * Opens the menu and disables body scrolling.
  */
  openMenu() {
    this.isMenuOpen = true;
    this.menuState.open();
    document.body.classList.add('no-scroll');
  }

  /**
  * Closes the menu and restores body scrolling.
  */
  closeMenu() {
    this.isMenuOpen = false;
    this.menuState.close();
    document.body.classList.remove('no-scroll');
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