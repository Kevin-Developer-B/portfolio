import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-project-elpolloloco',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './el-polo-loco.component.html',
  styleUrls: ['./el-polo-loco.component.scss']
})
export class ElPoloLocoComponent {

  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onCloseClick() {
    this.close.emit();
  }

  onNextClick() {
    this.next.emit();
  }

}
