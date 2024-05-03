import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AllFlowsComponent } from './all-flows/all-flows.component';
import { SingleFlowComponent } from './single-flow/single-flow.component';


@NgModule({
  declarations: [
    AllFlowsComponent,
    SingleFlowComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class FlowsModule { }
