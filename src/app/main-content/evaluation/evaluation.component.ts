import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Lang } from '../../language.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements AfterViewInit {

  @ViewChild('sliderTrack') sliderTrack!: ElementRef;
  @ViewChild('nextBtn') nextBtn!: ElementRef;
  @ViewChild('prevBtn') prevBtn!: ElementRef;
  @ViewChild('paginationDots') paginationDots!: ElementRef;

  cards!: HTMLElement[];
  clonedCards!: HTMLElement[];
  gap = 80;

  index = 0;
  centerOffset = 0;
  cardWidth = 0;
  totalCards = 0;
  visibleSlides = 3;
  maxDots = 3;
  isTransitioning = false;
  comments: string[] = [];

  constructor(private renderer: Renderer2, private translate: TranslateService, private http: HttpClient) { }

  ngOnInit() {
    this.loadCommentKeys(this.translate.currentLang);

    this.translate.onLangChange.subscribe(event => {
      this.loadCommentKeys(event.lang);
    });
  }

  ngAfterViewInit(): void { }

  initSlider() {
    this.clonedCards = [];
    setTimeout(() => {
      const track = this.sliderTrack.nativeElement;

      // 1. Originalkarten aus Angular suchen
      const originalCards = Array.from(track.querySelectorAll('.card')) as HTMLElement[];
      this.totalCards = originalCards.length;

      if (this.totalCards === 0) return; // Sicherheit

      this.totalCards = this.comments.length;

      this.clonedCards = [
        ...this.comments.map(key => this.createCard(key)), // Klone vor Originalen
        ...this.comments.map(key => this.createCard(key)), // Originalkarten
        ...this.comments.map(key => this.createCard(key))  // Klone nach Originalen
      ];


      track.innerHTML = ''; // Alten Inhalt löschen
      this.clonedCards.forEach(card => track.appendChild(card));

      // 3. Breiten berechnen (nachdem DOM fertig ist)
      const firstCard = track.querySelector('.card') as HTMLElement;
      this.cardWidth = firstCard.offsetWidth;

      const slideSize = this.cardWidth + this.gap;
      const containerWidth = track.parentElement.offsetWidth;

      this.centerOffset = (slideSize - containerWidth) / 1.85;

      // Startposition
      this.index = this.totalCards;
      this.updateSlider(true);

      // 4. Dots bauen + aktivieren
      this.buildPaginationDots();
      this.updateActiveDot();

      // Buttons + Listener
      this.renderer.listen(this.nextBtn.nativeElement, 'click', () => this.moveNext());
      this.renderer.listen(this.prevBtn.nativeElement, 'click', () => this.movePrev());
      this.renderer.listen(track, 'transitionend', () => this.handleTransitionEnd());
    });
  }

  // createCardFromOriginal(original: HTMLElement): HTMLElement {
  //   const card = this.renderer.createElement('div');
  //   this.renderer.addClass(card, 'card');

  //   const p = this.renderer.createElement('p');
  //   this.renderer.addClass(p, 'card-text');
  //   p.textContent = original.querySelector('.card-text')?.textContent || '';

  //   this.renderer.appendChild(card, p);
  //   return card;
  // }


  createCard(key: string): HTMLElement {
    const card = this.renderer.createElement('div');
    this.renderer.addClass(card, 'card');

    const p = this.renderer.createElement('p');
    this.renderer.addClass(p, 'card-text');
    p.textContent = this.translate.instant(key);

    this.renderer.appendChild(card, p);
    return card;
  }

  loadCommentKeys(lang: string) {
    const path = `assets/i18n/${lang}.json`;

    this.http.get<any>(path).subscribe(json => {
      this.comments = Object.keys(json)
        .filter(key => key.startsWith('comment'))
        .sort();

      // ❗ Slider erst starten, NACHDEM Angular das *ngFor gerendert hat
      setTimeout(() => {
        this.initSlider();
      });
    });
  }

  // --- SLIDER BEWEGEN ---
  moveNext() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.index++;
    this.updateSlider(false);
  }

  movePrev() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.index--;
    this.updateSlider(false);
  }

  updateSlider(disableTransition: boolean) {
    const track = this.sliderTrack.nativeElement;

    if (disableTransition) {
      this.renderer.setStyle(track, 'transition', 'none');
    } else {
      this.renderer.setStyle(track, 'transition', 'transform 0.95s ease');
    }
    const slideSize = this.cardWidth + this.gap;
    const moveX = this.index * slideSize + this.centerOffset;
    this.renderer.setStyle(track, 'transform', `translateX(-${moveX}px)`);
    this.updateActiveDot();
    this.updateActiveCardHighlight();
  }

  updateActiveCardHighlight() {
    if (!this.clonedCards) return;
    const currentSlideIndex = (this.index - this.totalCards + this.totalCards) % this.totalCards;
    this.clonedCards.forEach((card, i) => {
      const realIndex = i % this.totalCards;
      if (realIndex === currentSlideIndex) {
        this.renderer.addClass(card, 'active-card');
      } else {
        this.renderer.removeClass(card, 'active-card');
      }
    });
  }

  handleTransitionEnd() {
    this.isTransitioning = false;

    // Vorwärts über letzte Originalkarte hinaus → setze Index zurück auf Original
    if (this.index >= this.totalCards * 2) {
      this.index = this.totalCards;
      this.updateSlider(true);
    }

    // Rückwärts vor erste Originalkarte → setze Index zurück auf Original
    if (this.index < this.totalCards) {
      this.index = this.totalCards * 2 - 1;
      this.updateSlider(true);
    }

    this.updateActiveDot();
    this.updateActiveCardHighlight();
  }


  buildPaginationDots() {
    const dotContainer = this.paginationDots.nativeElement;
    dotContainer.innerHTML = ''; // vorherige Dots löschen

    const dotsToShow = Math.min(this.maxDots, this.totalCards); // max 3 oder weniger

    for (let i = 0; i < dotsToShow; i++) {
      const dot = this.renderer.createElement('div');
      this.renderer.addClass(dot, 'pagination-dot');
      this.renderer.listen(dot, 'click', () => {
        // berechne den Index so, dass der Dot auf die richtige Karte springt
        this.index = this.totalCards + i;
        this.updateSlider(false);
      });
      this.renderer.appendChild(dotContainer, dot);
    }
  }


  updateActiveDot() {
    if (!this.paginationDots) return;

    const dots = this.paginationDots.nativeElement.querySelectorAll('.pagination-dot');
    if (!dots.length) return;

    // berechne den Dot anhand der aktuellen Karte
    const dotIndex = ((this.index - this.totalCards + this.totalCards) % this.totalCards) % this.maxDots;

    dots.forEach((dot: HTMLElement, i: number) => {
      if (i === dotIndex) {
        this.renderer.addClass(dot, 'active');
      } else {
        this.renderer.removeClass(dot, 'active');
      }
    });
  }

}
