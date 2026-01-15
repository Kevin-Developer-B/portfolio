import { Component, OnInit } from '@angular/core';
import { JoinComponent } from './join/join.component';
import { CommonModule } from '@angular/common';
import { ElPoloLocoComponent } from './el-polo-loco/el-polo-loco.component';
import { DABubbleComponent } from './dabubble/dabubble.component';
import { LanguageService, Lang } from '../../language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [
    CommonModule, TranslateModule, JoinComponent, ElPoloLocoComponent, DABubbleComponent
  ],
  templateUrl: './featured-projects.component.html',
  styleUrls: ['./featured-projects.component.scss']
})
export class FeaturedProjectsComponent implements OnInit {

  overlayVisible = false;
  activeProject: string | null = null;

  currentLang: Lang = 'en';

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  openOverlay(projectName: string) {
    this.activeProject = projectName;
    this.overlayVisible = true;
    document.documentElement.classList.add('no-scroll');
  }

  closeOverlay() {
    this.overlayVisible = false;
    this.activeProject = null;
    document.documentElement.classList.remove('no-scroll');
  }

  projects = ['join', 'elpolloloco', 'dabubble'];

  showNextProject() {
    if (this.activeProject) {
      const currentIndex = this.projects.indexOf(this.activeProject);
      const nextIndex = (currentIndex + 1) % this.projects.length;
      this.activeProject = this.projects[nextIndex];
    }
  }


}
