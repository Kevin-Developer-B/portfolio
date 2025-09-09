import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-project-join',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {

  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onCloseClick() {
    this.close.emit();
  }

  onNextClick() {
    this.next.emit();
  }

}
