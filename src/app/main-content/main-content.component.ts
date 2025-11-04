import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { SkillSetComponent } from './skill-set/skill-set.component';
import { FeaturedProjectsComponent } from './featured-projects/featured-projects.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    LandingPageComponent,
    AboutMeComponent,
    SkillSetComponent,
    FeaturedProjectsComponent,
    EvaluationComponent,
    ContactFormComponent,
    FooterComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {

}
