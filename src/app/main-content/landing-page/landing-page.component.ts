import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { LanguageService, Lang } from '../../language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ CommonModule, HeaderComponent, TranslateModule ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit{

  currentLang: Lang = 'en';
  
    constructor(private languageService: LanguageService) {}
  
    ngOnInit(): void {
      // aktueller Wert vom Service
      this.currentLang = this.languageService.currentLang;
  
      // abonnieren für Live-Updates, falls Sprache anderswo geändert wird
      this.languageService.lang$.subscribe((lang: Lang) => {
        this.currentLang = lang;
      });
    }

}
