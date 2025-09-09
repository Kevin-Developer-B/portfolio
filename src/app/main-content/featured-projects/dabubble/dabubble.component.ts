import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-project-dabubble',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dabubble.component.html',
  styleUrls: ['./dabubble.component.scss']
})
export class DABubbleComponent {

  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onCloseClick() {
    this.close.emit();
  }

  onNextClick() {
    this.next.emit();
  }

}
