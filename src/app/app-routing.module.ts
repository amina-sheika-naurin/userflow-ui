import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllFlowsComponent } from './flows/all-flows/all-flows.component';
import { SingleFlowComponent } from './flows/single-flow/single-flow.component';
import { TreeFlowComponent } from './flows/tree-flow/tree-flow.component';

const routes: Routes = [
  { path: '', redirectTo: 'all_flows', pathMatch: 'full' }, 
  { path: 'all_flows', component: AllFlowsComponent },
  { path: 'single-flow/:id', component: SingleFlowComponent },
  { path: 'tree/:id', component:TreeFlowComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
