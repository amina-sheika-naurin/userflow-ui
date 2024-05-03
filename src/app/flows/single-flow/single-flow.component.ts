import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-single-flow',
  templateUrl: './single-flow.component.html',
  styleUrl: './single-flow.component.css'
})
export class SingleFlowComponent {

  flowData:any
  isExpanded: boolean = false;
  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    const flowId = this.route.snapshot.paramMap.get('id');
    if (flowId) {
      this.apiService.getFlow(flowId).subscribe
      ({
        next: (resp: any) => {
          this.flowData = resp
        }, 
        error(err) {
        },      
      })
    }
  }

  convertBase64ToImage(base64Data: string): string {
    return 'data:image/jpeg;base64,' + base64Data;
  }

  isImage(item: any): boolean {
    return !!item.image;
  }

  showImage: boolean = false;
enlargedImageUrl: string = '';

showLargeImage(imageUrl: string) {
  this.showImage = true;
  this.enlargedImageUrl = imageUrl;
}

hideLargeImage() {
  this.showImage = false;
  this.enlargedImageUrl = '';
}

toggleNavbar() {
  this.isExpanded = !this.isExpanded;
}
}
