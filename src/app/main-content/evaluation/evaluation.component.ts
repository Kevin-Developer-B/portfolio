import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Lang } from '../../language.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

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
  isTransitioning = false;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    const track = this.sliderTrack.nativeElement;

    // Original-Karten einlesen
    const originalCards = Array.from(track.querySelectorAll('.card')) as HTMLElement[];
    this.totalCards = originalCards.length;

    // Loop: Karten klonen
    this.clonedCards = [
      ...originalCards.map(c => c.cloneNode(true) as HTMLElement),
      ...originalCards,
      ...originalCards.map(c => c.cloneNode(true) as HTMLElement)
    ];

    // Track neu aufbauen
    track.innerHTML = '';
    this.clonedCards.forEach(card => track.appendChild(card));

    // Nach dem Rendern Breite auslesen
    setTimeout(() => {
      this.cardWidth = this.clonedCards[0].offsetWidth;

      // --- NEU: Karte 1 wirklich in der Mitte zentrieren ---
      const slideSize = this.cardWidth + this.gap;

      // Breite des Slider-Containers
      const containerWidth = this.sliderTrack.nativeElement.parentElement.offsetWidth;

      // Offset damit die Mitte von Karte 1 im Mittelpunkt des Containers liegt
      this.centerOffset = (slideSize - containerWidth) / 1.85;

      // Startposition auf die erste echte Karte
      this.index = this.totalCards;

      // Update mit deaktivierter Transition
      this.updateSlider(true);

      // Pagination bauen & aktualisieren
      this.buildPaginationDots();
      this.updateActiveDot();
    });

    // Buttons
    this.renderer.listen(this.nextBtn.nativeElement, 'click', () => this.moveNext());
    this.renderer.listen(this.prevBtn.nativeElement, 'click', () => this.movePrev());

    // Transition-Ende für Loop-Korrektur
    this.renderer.listen(track, 'transitionend', () => this.handleTransitionEnd());
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
    if (this.index >= this.totalCards * 2) {
      this.index = this.totalCards;
      this.updateSlider(true);
    }
    if (this.index < this.totalCards) {
      this.index = this.totalCards * 2 - 1;
      this.updateSlider(true);
    }
    this.updateActiveDot();
    this.updateActiveCardHighlight();
  }

  buildPaginationDots() {
    const dotContainer = this.paginationDots.nativeElement;
    for (let i = 0; i < this.totalCards; i++) {
      const dot = this.renderer.createElement('div');
      this.renderer.addClass(dot, 'pagination-dot');
      this.renderer.listen(dot, 'click', () => {
        this.index = this.totalCards + i;
        this.updateSlider(false);
      });
      this.renderer.appendChild(dotContainer, dot);
    }
  }

  updateActiveDot() {
    if (!this.paginationDots) return;
    const currentSlide = (this.index - this.totalCards + this.totalCards) % this.totalCards;
    const dots = this.paginationDots.nativeElement.querySelectorAll('.pagination-dot');
    dots.forEach((dot: HTMLElement, i: number) => {
      if (i === currentSlide) {
        this.renderer.addClass(dot, 'active');
      } else {
        this.renderer.removeClass(dot, 'active');
      }
    });
  }
}
