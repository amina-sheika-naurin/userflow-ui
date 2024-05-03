import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFlowComponent } from './single-flow.component';

describe('SingleFlowComponent', () => {
  let component: SingleFlowComponent;
  let fixture: ComponentFixture<SingleFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleFlowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
