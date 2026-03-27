import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { LegalNoticeComponent } from './main-content/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './main-content/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    {path: '', component: MainContentComponent},
    {path: 'legal-notice', component: LegalNoticeComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
];
