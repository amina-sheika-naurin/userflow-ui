import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AllFlowsComponent } from './all-flows/all-flows.component';
import { SingleFlowComponent } from './single-flow/single-flow.component';
import { LoaderComponent } from './loader/loader.component';
import { TreeFlowComponent } from './tree-flow/tree-flow.component';


@NgModule({
  declarations: [
    AllFlowsComponent,
    SingleFlowComponent,
    LoaderComponent,
    TreeFlowComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class FlowsModule { }
