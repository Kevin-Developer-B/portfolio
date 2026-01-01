import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'en' | 'de';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'language';
  
  private langSubject = new BehaviorSubject<Lang>('en');
  lang$ = this.langSubject.asObservable();

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('en');
    const saved = localStorage.getItem(this.STORAGE_KEY) as Lang;
    this.setLanguage(saved || 'en');
  }

  setLanguage(lang: Lang) {
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.translate.use(lang);
    this.langSubject.next(lang);
    document.documentElement.lang = lang.toLowerCase();
  }

  get currentLang(): Lang {
    return (localStorage.getItem(this.STORAGE_KEY) as Lang) || 'en';
  }
}
