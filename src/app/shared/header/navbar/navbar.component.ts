import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LanguageService, Lang } from '../../../language.service';
import { TranslateModule } from '@ngx-translate/core';

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

  constructor(private languageService: LanguageService) { }

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

  setLanguage(lang: 'en' | 'de') {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      this.toggleLanguage();
    }
  }

  currentActive(idx: number): void {
    this.activeIndex = idx;
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

}
