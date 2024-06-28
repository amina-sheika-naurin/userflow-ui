import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-single-flow',
  templateUrl: './single-flow.component.html',
  styleUrl: './single-flow.component.css'
})
export class SingleFlowComponent {
  showLoader:boolean= false
  flowData:any
  isExpanded: boolean = true
  responseData: any;
  shape:any;
  aspecRatio: string | undefined;
  boxLeft: number = 0;
  boxTop: number = 0;
  boxWidth: number = 0;
  boxHeight: number = 0;
  nodes: any=[];
  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.showLoader = true
    const flowId = this.route.snapshot.paramMap.get('id');
    if (flowId) {
      this.apiService.getFlow(flowId).subscribe
      ({
        next: (resp: any) => {
          this.flowData = resp.data
          this.showLoader = false
        }, 
        error(err) {
          console.log(err); 
        },      
      } )
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
    return !!item.base;
  }

  showImage: boolean = false;
  enlargedImageUrl: string = '';

  showLargeImage(imageUrl: string, id: string) {
    this.showImage = true;
    this.isExpanded = false;
    this.enlargedImageUrl = imageUrl;
    this.showLoader = true
    this.apiService.getComponents(id).subscribe({
      next: (resp: any) => {
        this.responseData = resp.components
        this.showLoader = false
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
    this.responseData = []
  }


  highlightArea(item: any) {
    const height = this.shape[0];
    let image:any = document.getElementById("image");
    let aratio = parseInt(height)/parseInt(image?.offsetHeight)
    this.locateNode(aratio,item)
    // const width = this.shape[1];

    // this.aspecRatio = `${(height / width) * 100}%`;
    // console.log(this.aspecRatio)

    // const { row_min, row_max, column_min, column_max } = position;

    // this.boxLeft = (column_min / width) * 100;
    // this.boxTop = (row_min / height) * 100;
    // this.boxWidth = ((column_max - column_min) / width) * 100;
    // this.boxHeight = ((row_max - row_min) / height) * 100;

  }

  locateNode(divider: any,item:any) {
    let x = 0, y = 0;
 
    if (item.component_data.position.column_min != 0)
      x = item.component_data.position.column_min / divider;
 
    if (item.component_data.position.row_min != 0)
      y = item.component_data.position.row_min / divider;

    // if (this.selDevice.technologyType.toLowerCase() === 'android') {
      let canvas:any = document.getElementById("image");
      let spy:any = document.getElementById("box");
      // spy.style.border = "black";
      spy.style.border = "#FF0000";
      spy.style.borderStyle = "solid";
      spy.style.position = "absolute";
      spy.style.height = item.component_data.height/ divider + Math.abs((canvas.offsetHeight - canvas.parentElement.clientHeight)/2)+ 7 + "px";
      spy.style.width = item.component_data.width / divider + (canvas.offsetWidth - canvas.parentElement.clientWidth) + "px";
      spy.style.top = (y - 6)+ "px";
      spy.style.left = (x - 2) + "px";
      spy.style.boxShadow = "inset #f7e5e4 0px 0px 60px -12px";
     
  }

  removeHighlight() {
    let box:any = document.getElementById("box");
    box.removeAttribute('style')
  }

  findLeafMostNodesAtPoint(px: any, py: any): any {
    let foundInChild: any = false, x: any, y: any, w: any, h: any;
    for (let child of this.responseData) {
      if (child.position) {
        x = parseInt(child.position.column_min);
        y = parseInt(child.position.row_min);
        w = parseInt(child.position.column_max);
        h = parseInt(child.position.row_max);
        if (x <= px && px <= w && y <= py && py <= h) {
          this.nodes.push(child);
          foundInChild = true;
        } else {
          foundInChild = false;
        }
      }
    }
    if (foundInChild)
      return true;
    else
      return false;
  }

  mousemove() {
    let image:any = document.getElementById("image");
    image.style.cursor = 'pointer';
    if(this.nodes.length==0)
      return;
    else{
      let li:any = document.getElementById(this.nodes[0].id)
      li.style.border = "#FF0000";
      li.style.borderStyle = "solid";
      li.style.boxShadow = "inset #f7e5e4 0px 0px 60px -12px";
    }
        
  }
 
  toggleAccordion(item: any) {
    item.isExpanded = !item.isExpanded;
  }


}
