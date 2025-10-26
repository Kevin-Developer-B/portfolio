import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { LanguageService, Lang } from '../../language.service';
import { TranslateModule } from '@ngx-translate/core';
import { HoverSlideDirective } from '../../shared/hover-slide.directive';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TranslateModule, HoverSlideDirective],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  currentLang: Lang = 'en';

  constructor(
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;

    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }
}
