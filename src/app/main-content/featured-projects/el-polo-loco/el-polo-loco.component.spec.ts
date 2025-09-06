import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElPoloLocoComponent } from './el-polo-loco.component';

describe('ElPoloLocoComponent', () => {
  let component: ElPoloLocoComponent;
  let fixture: ComponentFixture<ElPoloLocoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElPoloLocoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElPoloLocoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
