import {Component,ViewChild,ElementRef,AfterViewInit,Renderer2,OnInit,OnDestroy} from '@angular/core';
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
export class EvaluationComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('carouselList') carouselList!: ElementRef<HTMLUListElement>;
  @ViewChild('carouselViewport', { static: true }) carouselViewport!: ElementRef<HTMLDivElement>;

  private langSub!: Subscription;
  currentLang: Lang = 'en';

  rawCards = [
    { key: 'comment1', writer: 'T. Schulz - Frontend Developer' },
    { key: 'comment2', writer: 'H. Janisch - Team Partner' },
    { key: 'comment3', writer: 'A. Fischer - Team Partner' },
  ];

  cards: { comment: string; writer: string }[] = [];

  itemWidth = 40;
  startOffset = 0;
  isAnimating = false;
  activeIndex = 1;

  constructor(
    private renderer: Renderer2,
    private languageService: LanguageService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.langSub = this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
      this.updateCards();
    });
    this.updateCards();
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  private updateCards(): void {
    this.cards = [];

    this.rawCards.forEach(card => {
      this.translate.get(card.key).subscribe((translated: string) => {
        this.cards.push({ comment: translated, writer: card.writer });
      });
    });
  }

  ngAfterViewInit(): void {
    const firstItem = this.carouselList.nativeElement.querySelector('.carousel-item') as HTMLElement;
    if (!firstItem) return;

    const gap = 100;
    this.itemWidth = firstItem.offsetWidth + gap;

    const containerWidth = this.carouselViewport.nativeElement.offsetWidth;
    const middleIndex = 1;

    this.startOffset = (this.itemWidth * middleIndex) - (containerWidth / 2) + (firstItem.offsetWidth / 2);
    this.carouselList.nativeElement.style.transform = `translateX(-${this.startOffset}px)`;
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
