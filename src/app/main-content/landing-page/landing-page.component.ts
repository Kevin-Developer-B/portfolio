import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HoverSlideDirective } from '../../shared/hover-slide.directive';
import { LanguageService, Lang } from '../../language.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TranslateModule, HoverSlideDirective],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements AfterViewInit {

  @ViewChild('trackEl', { static: false }) trackEl!: ElementRef;

  currentLang: Lang = 'en';
  slides = ['remote', 'fontend_developer', 'based', 'work'];

  constructor(
    private languageService: LanguageService,
    private renderer: Renderer2,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  ngAfterViewInit() {
    // Warte auf Render der initialen Übersetzungen
    setTimeout(() => {
      if (this.trackEl && this.trackEl.nativeElement) {
        this.renderer.addClass(this.trackEl.nativeElement, 'scrolling');
      }
    });
  }
}
