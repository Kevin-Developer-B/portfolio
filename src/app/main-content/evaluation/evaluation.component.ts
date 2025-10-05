import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements AfterViewInit {
  @ViewChild('carouselList') carouselList!: ElementRef<HTMLUListElement>;
  @ViewChild('carouselViewport', { static: true }) carouselViewport!: ElementRef<HTMLDivElement>;


  cards = [
    { title: 'Karte 1', text: 'Beschreibung 1' },
    { title: 'Karte 2', text: 'Beschreibung 2' },
    { title: 'Karte 3', text: 'Beschreibung 3' }
  ];

  itemWidth = 40;
  startOffset = 0;
  isAnimating = false;
  activeIndex = 0;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    const firstItem = this.carouselList.nativeElement.querySelector('.carousel-item') as HTMLElement;
    if (firstItem) {
      const gap = 60;
      this.itemWidth = firstItem.offsetWidth + gap;

      const containerWidth = this.carouselViewport.nativeElement.offsetWidth;
      const middleIndex = 1

      this.startOffset = (this.itemWidth * middleIndex) - (containerWidth / 2) + (firstItem.offsetWidth / 2);

      this.carouselList.nativeElement.style.transform = `translateX(-${this.startOffset}px)`;
    }
  }

  next(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const list = this.carouselList.nativeElement;
    const first = list.firstElementChild as HTMLElement;

    const clone = first.cloneNode(true) as HTMLElement;
    this.renderer.appendChild(list, clone);

    requestAnimationFrame(() => {
      list.style.transition = 'transform 0.5s ease';
      list.style.transform = `translateX(-${this.startOffset + this.itemWidth}px)`;
    });

    setTimeout(() => {
      this.renderer.removeChild(list, first);
      list.style.transition = 'none';
      list.style.transform = `translateX(-${this.startOffset}px)`;
      this.isAnimating = false;
      this.activeIndex = (this.activeIndex + 1) % this.cards.length;
    }, 500);
  }

  prev(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const list = this.carouselList.nativeElement;
    const last = list.lastElementChild as HTMLElement;

    const clone = last.cloneNode(true) as HTMLElement;
    this.renderer.insertBefore(list, clone, list.firstChild);

    list.style.transition = 'none';
    list.style.transform = `translateX(-${this.startOffset + this.itemWidth}px)`;

    requestAnimationFrame(() => {
      list.style.transition = 'transform 0.5s ease';
      list.style.transform = `translateX(-${this.startOffset}px)`;
    });

    setTimeout(() => {
      this.renderer.removeChild(list, last);
      this.isAnimating = false;
      this.activeIndex =
        (this.activeIndex - 1 + this.cards.length) % this.cards.length;
    }, 500);
  }
}