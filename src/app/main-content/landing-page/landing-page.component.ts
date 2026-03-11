import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { HoverSlideDirective } from '../../shared/hover-slide.directive';
import { LanguageService, Lang } from '../../language.service';
import { NavbarComponent } from '../../shared/header/navbar/navbar.component';
import { MenuStateService } from '../../services/menu-state-service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavbarComponent, TranslateModule, HoverSlideDirective],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})

export class LandingPageComponent implements AfterViewInit {
  @ViewChild('trackEl', { static: false }) trackEl!: ElementRef;
  currentLang: Lang = 'en';
  slides = ['remote', 'fontend_developer', 'based', 'work'];
  isOverlayOpen$ = this.menuState.state$();

  constructor(
    private languageService: LanguageService, private renderer: Renderer2, private menuState: MenuStateService) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.renderer.addClass(this.trackEl.nativeElement, 'scrolling');
      });
    });
  }

  stopArrow() {
    this.menuState.open();
  }
}
