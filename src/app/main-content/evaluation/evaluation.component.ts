import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Lang } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import Splide from '@splidejs/splide';
import en from './../../../assets/i18n/en.json';
import de from './../../../assets/i18n/de.json';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})

export class EvaluationComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('splideRoot', { static: true })
  splideRoot!: ElementRef<HTMLElement>;

  currentLang: Lang = 'en';
  testimonials = en.comments;
  private splide!: Splide;
  activeIndex = 0;

  /**
  * Creates the component and injects the LanguageService.
  */
  constructor(private languageService: LanguageService) { }

  /**
  * Initializes the current language and subscribes to language changes.
  */
  ngOnInit() {
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
      this.testimonials = lang === 'en'
        ? en.comments
        : de.comments;
      setTimeout(() => this.splide?.refresh());
    });
  }

  /**
  * Initializes the Splide slider after the view has been fully initialized.
  * Sets slider options, registers movement event listener,
  * and mounts the slider instance.
  */
  ngAfterViewInit() {
    this.splide = new Splide(this.splideRoot.nativeElement, {
      type: 'loop',
      focus: 'center',
      perPage: 2,
      gap: '40px',
      arrows: false,
      pagination: false,
      breakpoints: {
        1024: { 
          perPage: 2,
          gap: '10px',
         },
        700: { 
          perPage: 1, 
          gap: '0.5px',
          padding: '40px'
        },
      },
    });
    this.splide.on('moved', (index) => {
      this.activeIndex = index;
    });
    this.splide.mount();
  }

  /**
  * Navigates the slider to the previous slide.
  */
  goPrev() {
    this.splide.go('<');
  }

  /**
  * Navigates the slider to the next slide.
  */
  goNext() {
    this.splide.go('>');
  }

  /**
  * Cleans up the Splide instance when the component is destroyed
  * to prevent memory leaks.
  */
  ngOnDestroy() {
    this.splide?.destroy();
  }
}


















// import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { LanguageService, Lang } from '../../language.service';
// import { Subscription } from 'rxjs';
// import { TranslateService } from '@ngx-translate/core';
// import { TranslateModule } from '@ngx-translate/core';
// import { HttpClient } from '@angular/common/http';
// // import { CardSliderComponent } from './slider/card-slider/card-slider.component';


// @Component({
//   selector: 'app-evaluation',
//   standalone: true,
//   imports: [CommonModule, TranslateModule],
//   templateUrl: './evaluation.component.html',
//   styleUrls: ['./evaluation.component.scss']
// })
// export class EvaluationComponent implements AfterViewInit {

//   @ViewChild('sliderTrack') sliderTrack!: ElementRef;
//   @ViewChild('nextBtn') nextBtn!: ElementRef;
//   @ViewChild('prevBtn') prevBtn!: ElementRef;
//   @ViewChild('paginationDots') paginationDots!: ElementRef;

//   cards!: HTMLElement[];
//   clonedCards!: HTMLElement[];
//   gap = 80;

//   index = 0;
//   centerOffset = 0;
//   cardWidth = 0;
//   totalCards = 0;
//   visibleSlides = 3;
//   maxDots = 3;
//   isTransitioning = false;
//   comments: { text: string, author: string }[] = [];

//   constructor(private renderer: Renderer2, private translate: TranslateService, private http: HttpClient) { }

//   ngOnInit() {
//     this.loadCommentKeys(this.translate.currentLang);

//     this.translate.onLangChange.subscribe(event => {
//       this.loadCommentKeys(event.lang);
//     });
//   }

//   ngAfterViewInit(): void { }

//   initSlider() {
//     this.clonedCards = [];
//     setTimeout(() => {
//       const track = this.sliderTrack.nativeElement;
//       const originalCards = Array.from(track.querySelectorAll('.card')) as HTMLElement[];
//       this.totalCards = originalCards.length;
//       if (this.totalCards === 0) return;
//       this.totalCards = this.comments.length;
//       this.clonedCards = [
//         ...this.comments.map(key => this.createCard(key)),
//         ...this.comments.map(key => this.createCard(key)),
//         ...this.comments.map(key => this.createCard(key))
//       ];
//       track.innerHTML = '';
//       this.clonedCards.forEach(card => track.appendChild(card));
//       const firstCard = track.querySelector('.card') as HTMLElement;
//       this.cardWidth = firstCard.offsetWidth;
//       const slideSize = this.cardWidth + this.gap;
//       const containerWidth = track.parentElement.offsetWidth;
//       this.centerOffset = (slideSize - containerWidth) / 1.85;
//       this.index = this.totalCards;
//       this.updateSlider(true);
//       this.buildPaginationDots();
//       this.updateActiveDot();
//       this.renderer.listen(this.nextBtn.nativeElement, 'click', () => this.moveNext());
//       this.renderer.listen(this.prevBtn.nativeElement, 'click', () => this.movePrev());
//       this.renderer.listen(track, 'transitionend', () => this.handleTransitionEnd());
//     });
//   }

//   createCard(comment: { text: string, author: string }): HTMLElement {
//     const card = this.renderer.createElement('div');
//     this.renderer.addClass(card, 'card')
//     const p = this.renderer.createElement('p');
//     this.renderer.addClass(p, 'card-text');
//     p.textContent = comment.text;
//     const author = this.renderer.createElement('span');
//     this.renderer.addClass(author, 'card-author');
//     author.textContent = `${comment.author}`;
//     this.renderer.appendChild(card, p);
//     this.renderer.appendChild(card, author);
//     return card;
//   }

//   loadCommentKeys(lang: string) {
//     const path = `assets/i18n/${lang}.json`;
//     this.http.get<any>(path).subscribe(json => {
//       const commentSection = json['comments'] ?? {};
//       this.comments = Object.keys(commentSection)
//         .map(key => ({
//           text: commentSection[key].text,
//           author: commentSection[key].author
//         }));
//       setTimeout(() => {
//         this.initSlider();
//       });
//     });
//   }

//   moveNext() {
//     if (this.isTransitioning) return;
//     this.isTransitioning = true;
//     this.index++;
//     this.updateSlider(false);
//   }

//   movePrev() {
//     if (this.isTransitioning) return;
//     this.isTransitioning = true;
//     this.index--;
//     this.updateSlider(false);
//   }

//   updateSlider(disableTransition: boolean) {
//     const track = this.sliderTrack.nativeElement;

//     if (disableTransition) {
//       this.renderer.setStyle(track, 'transition', 'none');
//     } else {
//       this.renderer.setStyle(track, 'transition', 'transform 0.95s ease');
//     }
//     const slideSize = this.cardWidth + this.gap;
//     const moveX = this.index * slideSize + this.centerOffset;
//     this.renderer.setStyle(track, 'transform', `translateX(-${moveX}px)`);
//     this.updateActiveDot();
//     this.updateActiveCardHighlight();
//   }

//   updateActiveCardHighlight() {
//     if (!this.clonedCards) return;
//     const currentSlideIndex = (this.index - this.totalCards + this.totalCards) % this.totalCards;
//     this.clonedCards.forEach((card, i) => {
//       const realIndex = i % this.totalCards;
//       if (realIndex === currentSlideIndex) {
//         this.renderer.addClass(card, 'active-card');
//       } else {
//         this.renderer.removeClass(card, 'active-card');
//       }
//     });
//   }

//   handleTransitionEnd() {
//     this.isTransitioning = false;

//     if (this.index >= this.totalCards * 2) {
//       this.index = this.totalCards;
//       this.updateSlider(true);
//     }

//     if (this.index < this.totalCards) {
//       this.index = this.totalCards * 2 - 1;
//       this.updateSlider(true);
//     }

//     this.updateActiveDot();
//     this.updateActiveCardHighlight();
//   }

//   buildPaginationDots() {
//     const dotContainer = this.paginationDots.nativeElement;
//     dotContainer.innerHTML = '';

//     const dotsToShow = Math.min(this.maxDots, this.totalCards);

//     for (let i = 0; i < dotsToShow; i++) {
//       const dot = this.renderer.createElement('div');
//       this.renderer.addClass(dot, 'pagination-dot');
//       this.renderer.listen(dot, 'click', () => {
//         this.index = this.totalCards + i;
//         this.updateSlider(false);
//       });
//       this.renderer.appendChild(dotContainer, dot);
//     }
//   }

//   updateActiveDot() {
//     if (!this.paginationDots) return;

//     const dots = this.paginationDots.nativeElement.querySelectorAll('.pagination-dot');
//     if (!dots.length) return;

//     const dotIndex = ((this.index - this.totalCards + this.totalCards) % this.totalCards) % this.maxDots;

//     dots.forEach((dot: HTMLElement, i: number) => {
//       if (i === dotIndex) {
//         this.renderer.addClass(dot, 'active');
//       } else {
//         this.renderer.removeClass(dot, 'active');
//       }
//     });
//   }
// }


