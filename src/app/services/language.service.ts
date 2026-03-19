import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'en' | 'de';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'language';
  private langSubject = new BehaviorSubject<Lang>('en');
  lang$ = this.langSubject.asObservable();

  /**
  * Initializes the translation service, adds supported languages,
  * sets the default language, and applies a previously saved language if available.
  * @param translate The translation service instance.
  */
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('en');
    const saved = localStorage.getItem(this.STORAGE_KEY) as Lang;
    this.setLanguage(saved || 'en');
  }

  /**
  * Sets the application's language.
  * Saves it in localStorage, updates the translation service,
  * notifies subscribers, and updates the HTML document's language.
  * @param lang The language to set.
  */
  setLanguage(lang: Lang) {
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.translate.use(lang);
    this.langSubject.next(lang);
    document.documentElement.lang = lang.toLowerCase();
  }

  /**
  * Gets the current application language.
  * Falls back to 'en' if none is saved.
  */
  get currentLang(): Lang {
    return (localStorage.getItem(this.STORAGE_KEY) as Lang) || 'en';
  }
}
