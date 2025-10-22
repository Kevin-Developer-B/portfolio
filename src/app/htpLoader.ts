import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class MyHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, private prefix = '/assets/i18n/', private suffix = '.json') {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}
