import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LanguageService, Lang } from '../../language.service';
import { TranslateModule } from '@ngx-translate/core';
import { HoverSlideDirective } from '../../shared/hover-slide.directive';

@Component({
  selector: 'app-skill-set',
  standalone: true,
  imports: [CommonModule, TranslateModule, HoverSlideDirective],
  templateUrl: './skill-set.component.html',
  styleUrl: './skill-set.component.scss'
})
export class SkillSetComponent implements OnInit {
  showInterrest = false;

  currentLang: Lang = 'en';

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;

    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  onMouseEnter() {
    this.showInterrest = true;
  }

  onMouseLeave() {
    this.showInterrest = false;
  }

}
