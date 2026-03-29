import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { SkillSetComponent } from './skill-set/skill-set.component';
import { FeaturedProjectsComponent } from './featured-projects/featured-projects.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

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
    LegalNoticeComponent,
    PrivacyPolicyComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent { }
