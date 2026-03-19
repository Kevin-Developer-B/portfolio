import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { LanguageService, Lang } from '../../../services/language.service';
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
  @Output() close = new EventEmitter<void>();
  /** Emits when the next action is triggered. */
  @Output() next = new EventEmitter<void>();
  currentLang: Lang = 'en';

  /**
  * Creates the component and injects the language service.
  * @param languageService Service used to manage and observe the current language.
  */
  constructor(private languageService: LanguageService) { }

  /**
  * Initializes the component and sets the current language.
  * Subscribes to language changes to keep the value updated.
  */
  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;

    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  /** Emits the close event when the close button is clicked. */
  onCloseClick() {
    this.close.emit();
  }

  /** Emits the next event when the next button is clicked. */
  onNextClick() {
    this.next.emit();
  }
}
