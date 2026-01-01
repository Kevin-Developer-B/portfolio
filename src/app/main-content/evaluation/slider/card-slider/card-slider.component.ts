import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Splide from '@splidejs/splide';
import { LanguageService, Lang } from '../../../../language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-card-slider',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.scss'],
})
export class CardSliderComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('splideRoot', { static: true })
  splideRoot!: ElementRef<HTMLElement>;

  private splide!: Splide;
  activeIndex = 0;
  currentLang: Lang = 'en';

  comments = [
    { text: 'comments.comment1.text', author: 'comments.comment1.author' },
    { text: 'comments.comment2.text', author: 'comments.comment2.author' },
    { text: 'comments.comment3.text', author: 'comments.comment3.author' },
  ];

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
      setTimeout(() => this.syncCloneTexts());
    });
  }

  ngAfterViewInit() {
    this.splide = new Splide(this.splideRoot.nativeElement, {
      type: 'loop',
      focus: 'center',
      perPage: 2,
      gap: '3rem',
      arrows: false,
      pagination: false,
      breakpoints: {
        1024: { perPage: 2 },
        640: { perPage: 2 },
      },
    });

    this.splide.on('mounted moved', () => {
      this.syncCloneTexts();
    });

    this.splide.mount();
  }

  private syncCloneTexts(): void {
    const root = this.splideRoot.nativeElement;

    const realSlides = Array.from(
      root.querySelectorAll('.splide__slide:not(.splide__slide--clone)')
    );

    const clones = Array.from(
      root.querySelectorAll('.splide__slide--clone')
    );

    clones.forEach((clone, index) => {
      const realSlide = realSlides[index % realSlides.length];
      if (!realSlide) return;

      const realText = realSlide.querySelector('p')?.textContent ?? '';
      const realAuthor = realSlide.querySelector('strong')?.textContent ?? '';

      const cloneText = clone.querySelector('p');
      const cloneAuthor = clone.querySelector('strong');

      if (cloneText) cloneText.textContent = realText;
      if (cloneAuthor) cloneAuthor.textContent = realAuthor;
    });
  }


  goPrev() {
    this.splide.go('<');
  }

  goNext() {
    this.splide.go('>');
  }

  ngOnDestroy() {
    this.splide?.destroy();
  }
}
