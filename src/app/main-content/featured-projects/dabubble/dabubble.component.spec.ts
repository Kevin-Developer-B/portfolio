import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DABubbleComponent } from './dabubble.component';

describe('DABubbleComponent', () => {
  let component: DABubbleComponent;
  let fixture: ComponentFixture<DABubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DABubbleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DABubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
