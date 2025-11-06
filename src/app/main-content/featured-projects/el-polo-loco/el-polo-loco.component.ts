import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { LanguageService, Lang } from '../../../language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-elpolloloco',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule
  ],
  templateUrl: './el-polo-loco.component.html',
  styleUrls: ['./el-polo-loco.component.scss']
})
export class ElPoloLocoComponent implements OnInit {
  currentLang: Lang = 'en';

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;

    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onCloseClick() {
    this.close.emit();
  }

  onNextClick() {
    this.next.emit();
  }

}
