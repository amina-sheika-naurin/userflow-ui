import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-all-flows',
  templateUrl: './all-flows.component.html',
  styleUrl: './all-flows.component.css'
})


export class AllFlowsComponent {

  flows: any[] = [];
  showLoader:boolean=false

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.showLoader=true
    this.apiService.getAllFlows().subscribe({
      next:(response: any) => {
        response = response.simulations
        this.flows = response
    //     this.flows = response.map((flow: { createdOn: { $date: string | number | Date; }; }) => ({
    //       ...flow,
    //       createdOn: new Date(flow.createdOn.$date)  
    //     }
    //   )
    // );
      this.showLoader = false; 
      },
      error(err){
        console.log(err)
      },
    }
  )
  }

  onCardClick(flow: any): void {
    this.router.navigate(['/single-flow', flow]);
  }

}
