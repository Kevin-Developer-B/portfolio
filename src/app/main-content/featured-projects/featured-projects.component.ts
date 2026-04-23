import { Component, OnInit } from '@angular/core';
import { JoinComponent } from './join/join.component';
import { CommonModule } from '@angular/common';
import { ElPoloLocoComponent } from './el-polo-loco/el-polo-loco.component';
import { MemoryComponent } from './memory/memory.component';
import { LanguageService, Lang } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    JoinComponent, 
    ElPoloLocoComponent, 
    MemoryComponent
  ],
  templateUrl: './featured-projects.component.html',
  styleUrls: ['./featured-projects.component.scss']
})
export class FeaturedProjectsComponent implements OnInit {
  overlayVisible = false;
  activeProject: string | null = null;
  currentLang: Lang = 'en';
  projects = ['join', 'elpolloloco', 'memory'];

  /**
  * Creates the component and injects the language service.
  * @param languageService Service used to manage and observe the current language.
  */
  constructor(private languageService: LanguageService) { }

  /**
  * Initializes the current language and subscribes to language changes.
  * Updates the component state whenever the language changes.
  */
  ngOnInit(): void {
    this.currentLang = this.languageService.currentLang;
    this.languageService.lang$.subscribe((lang: Lang) => {
      this.currentLang = lang;
    });
  }

  /**
  * Opens the project overlay for the given project name
  * and disables page scrolling.
  * @param projectName Name of the project to display in the overlay.
  */
  openOverlay(projectName: string) {
    this.activeProject = projectName;
    this.overlayVisible = true;
    document.documentElement.classList.add('no-scroll');
  }

  /**
  * Closes the project overlay, resets the active project,
  * and re-enables page scrolling.
  */
  closeOverlay() {
    this.overlayVisible = false;
    this.activeProject = null;
    document.documentElement.classList.remove('no-scroll');
  }

  /**
  * Switches to the next project in the list.
  * Loops back to the first project after the last one.
  */
  showNextProject() {
    if (this.activeProject) {
      const currentIndex = this.projects.indexOf(this.activeProject);
      const nextIndex = (currentIndex + 1) % this.projects.length;
      this.activeProject = this.projects[nextIndex];
    }
  }
}
