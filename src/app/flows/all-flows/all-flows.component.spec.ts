import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFlowsComponent } from './all-flows.component';

describe('AllFlowsComponent', () => {
  let component: AllFlowsComponent;
  let fixture: ComponentFixture<AllFlowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllFlowsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
