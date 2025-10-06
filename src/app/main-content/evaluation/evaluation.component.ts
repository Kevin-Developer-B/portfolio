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
    {  comment: "Our project beneficted enormously from Simon efficient way of working", writer: "T. Schulz - Frontend Feveloper"},
    {  comment: "Lukas has proven to be a reliable group partner. His technical skills and proactive approach were crucial to the success of our project.", writer: "H. Janisch - Team Partner"},
    {  comment: "I dad the good fortune of working with Lukas in a group project at the Developer Akademie that involved a lot of effort. He always stayed calm, cool, and focused, and made sure our team was set up for success. He's super knowledgeable, easy to work with and I'd happily work with him again given the chance.", writer: "A. Fischer - Team Partner"}
  ];

  itemWidth = 40;
  startOffset = 0;
  isAnimating = false;
  activeIndex = 1;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    const firstItem = this.carouselList.nativeElement.querySelector('.carousel-item') as HTMLElement;
    if (firstItem) {
      const gap = 100;
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
      list.style.transition = 'transform 0.45s ease';
      list.style.transform = `translateX(-${this.startOffset + this.itemWidth}px)`;
    });

    setTimeout(() => {
      this.renderer.removeChild(list, first);
      list.style.transition = 'none';
      list.style.transform = `translateX(-${this.startOffset}px)`;

      this.activeIndex = (this.activeIndex + 1) % this.cards.length;

      const items = list.querySelectorAll('.carousel-item');
      items.forEach(el => el.classList.remove('active'));
      if (items[1]) items[1].classList.add('active');

      this.isAnimating = false;
    }, 350);
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

      this.activeIndex = (this.activeIndex - 1 + this.cards.length) % this.cards.length;

      const items = list.querySelectorAll('.carousel-item');
      items.forEach(el => el.classList.remove('active'));
      if (items[1]) items[1].classList.add('active');

      this.isAnimating = false;
    }, 300);
  }

  getDotIndex(index: number): boolean {
    const mappedIndex = (this.activeIndex - 1 + this.cards.length) % this.cards.length;
    return index === mappedIndex;
  }
}