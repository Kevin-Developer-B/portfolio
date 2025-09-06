import { Component } from '@angular/core';
import { JoinComponent } from './join/join.component';
import { CommonModule } from '@angular/common';
import { ElPoloLocoComponent } from './el-polo-loco/el-polo-loco.component';
import { DABubbleComponent } from './dabubble/dabubble.component';

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [
    CommonModule,
    JoinComponent,
    ElPoloLocoComponent,
    DABubbleComponent
  ],
  templateUrl: './featured-projects.component.html',
  styleUrls: ['./featured-projects.component.scss']
})
export class FeaturedProjectsComponent {

  overlayVisible = false;
  activeProject: string | null = null;

  openOverlay(projectName: string) {
    this.activeProject = projectName;
    this.overlayVisible = true;
  }

  closeOverlay() {
    this.overlayVisible = false;
    this.activeProject = null;
  }

}
