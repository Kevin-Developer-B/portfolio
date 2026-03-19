import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class MyHttpLoader implements TranslateLoader {

  /**
  * Creates a TranslationService instance.
  * @param http - Angular HttpClient for HTTP requests.
  * @param prefix - Optional path prefix for translation files. Default is '/assets/i18n/'.
  * @param suffix - Optional file suffix for translation files. Default is '.json'.
  */
  constructor(private http: HttpClient, private prefix = '/assets/i18n/', private suffix = '.json') {}

  /**
  * Fetches the translation JSON for the specified language.
  * @param lang - Language code (e.g., 'en', 'de').
  * @returns Observable of the translation object.
  */
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}
