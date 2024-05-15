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
  isExpanded: boolean = true
  responseData: any;
  shape:any;
  aspecRatio: string | undefined;
  boxLeft: number = 0;
  boxTop: number = 0;
  boxWidth: number = 0;
  boxHeight: number = 0;
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

  convertBase64ToImageStoreShape(base64Data: string, shape:any): string {
    this.shape = shape
    return 'data:image/jpeg;base64,' + base64Data;
  }

  isImage(item: any): boolean {
    return !!item.image;
  }

  showImage: boolean = false;
  enlargedImageUrl: string = '';

  showLargeImage(imageUrl: string, id: string) {
    this.showImage = true;
    this.isExpanded = false;
    this.enlargedImageUrl = imageUrl;
    this.apiService.getComponents(id).subscribe({
      next: (resp: any) => {
        this.responseData = resp.components
      },
      error(err){
      },
    })
  }

  hideLargeImage() {
    this.showImage = false;
    this.enlargedImageUrl = '';
  }

  toggleNavbar() {
    this.isExpanded = !this.isExpanded;
  }


  highlightArea(position: any) {
    const height = this.shape[0];
    const width = this.shape[1];

    this.aspecRatio = `${(height / width) * 100}%`;

    const { row_min, row_max, column_min, column_max } = position;

    this.boxLeft = (column_min / width) * 100;
    this.boxTop = (row_min / height) * 100;
    this.boxWidth = ((column_max - column_min) / width) * 100;
    this.boxHeight = ((row_max - row_min) / height) * 100;
  }

  removeHighlight() {
    this.boxLeft = 0
    this.boxTop = 0
    this.boxWidth = 0
    this.boxHeight = 0
  }

  


}
