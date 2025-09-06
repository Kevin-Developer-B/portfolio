import { Component } from '@angular/core';

@Component({
  selector: 'app-skill-set',
  standalone: true,
  imports: [],
  templateUrl: './skill-set.component.html',
  styleUrl: './skill-set.component.scss'
})
export class SkillSetComponent {
  showInterrest = false;

  constructor() {}

  onMouseEnter() {
    this.showInterrest = true;
  }

  onMouseLeave() {
    this.showInterrest = false;
  }

}
