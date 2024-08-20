import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeFlowComponent } from './tree-flow.component';

describe('TreeFlowComponent', () => {
  let component: TreeFlowComponent;
  let fixture: ComponentFixture<TreeFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TreeFlowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreeFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
