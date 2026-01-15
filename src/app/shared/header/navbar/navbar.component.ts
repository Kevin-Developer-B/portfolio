import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LanguageService, Lang } from '../../../language.service';
import { TranslateModule } from '@ngx-translate/core';
import { MenuStateService } from '../../../services/menu-state-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentLang: Lang = 'en';
  activeIndex: number | null = null;
  isMenuOpen = false;

  constructor(private languageService: LanguageService, private menuState: MenuStateService) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  toggleLanguage(): void {
    const newLang: Lang = this.currentLang === 'en' ? 'de' : 'en';
    this.languageService.setLanguage(newLang);
  }

  switchLang(lang: Lang) {
    this.languageService.setLanguage(lang);
  }

  setLanguage(lang: 'en' | 'de') {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      this.toggleLanguage();
    }
  }

  currentActive(idx: number): void {
    this.activeIndex = idx;
  }

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

  openMenu() {
    this.isMenuOpen = true;
    this.menuState.open();
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.menuState.close();
    document.body.style.overflow = '';
  }

}
