import { Component } from '@angular/core' 
import { ActivatedRoute } from '@angular/router' 
import { ApiService } from '../api.service' 

@Component({
  selector: 'app-single-flow',
  templateUrl: './single-flow.component.html',
  styleUrl: './single-flow.component.css'
})
export class SingleFlowComponent {
  showLoader:boolean= false
  flowData:any
  isExpanded: boolean = true
  responseData: any 
  doc:any
  shape:any 
  aspecRatio: string | undefined 
  boxLeft: number = 0 
  boxTop: number = 0 
  boxWidth: number = 0 
  boxHeight: number = 0 
  nodes: any=[] 
  constructor(
    private route: ActivatedRoute, 
    private apiService: ApiService, 
    // private parser:DOMParser
  ) { }

  ngOnInit(): void {
    this.showLoader = true
    const flowId = this.route.snapshot.paramMap.get('id') 
    if (flowId) {
      this.apiService.getFlow(flowId).subscribe
      ({
        next: (resp: any) => {
          this.flowData = resp.bases
          this.showLoader = false
        }, 
        error(err) {
          console.log(err)  
        },      
      } )
    }
  }

  convertBase64ToImage(base64Data: string): string {
    return 'data:image/jpeg;base64,' + base64Data 
  }

  // convertBase64ToImageStoreShape(base64Data: string): string {
  //   return 'data:image/jpeg;base64,' + base64Data;
  // }

  // isImage(item: any): boolean {
  //   return !!item.base;
  // }

  showImage: boolean = false 
  enlargedImageUrl: string = '' 

  showLargeImage(baseid:any,imageUrl: any, html: string) {
    this.showImage = true 
    // this.isExpanded = false 
    this.enlargedImageUrl = imageUrl 
    // this.responseData = html
    this.maketree(html)
    this.showLoader = true
    this.apiService.getComponents(baseid).subscribe({
      next: (resp: any) => {
        // this.responseData = resp.components
        this.showLoader = false
      },
      error(err){
      },
    })
  }

  filterElements(node:any, allowedTags:any) {
    for (var i = node.children.length - 1; i >= 0; i--) {
      var child = node.children[i];
      if (!allowedTags.includes(child.tagName.toLowerCase())) {
        child.parentNode.removeChild(child);
      } else {
        this.filterElements(child, allowedTags);
      }
    }
    return node; 
  }


  maketree(html: string) {
     let allowedTags = [
      'body','div', 'span', 'section', 'article', 'header', 'footer', 'nav', 'aside', 'main',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'a',
      'img', 'audio', 'video',
      'button', 'form', 'input', 'label', 'select', 'textarea',
      'figure', 'figcaption', 'time', 'address', 'details', 'summary',
      'table', 'tr', 'td', 'th',
      'ul', 'ol', 'li', 'dialog', 'center'
    ];
    const parser = new DOMParser()
    const parsedDoc = parser.parseFromString(html, 'text/html')
    this.doc = parsedDoc.body
    // this.doc =  this.filterElements(parsedDoc.body, allowedTags) 
  }

  // escapeHtml(html: string): string {
  //   return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // }
  
  
  // maketree(html : any){
    
  //   var parser = new DOMParser() 
  //   this.doc =  parser.parseFromString(html, "text/html")
    
  //   this.doc  = this.doc.body
  // }
    // var allowedTags = [
    //   'body','div', 'span', 'section', 'article', 'header', 'footer', 'nav', 'aside', 'main',
    //   'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
    //   'img', 'audio', 'video',
    //   'button', 'form', 'input', 'label', 'select', 'textarea',
    //   'figure', 'figcaption', 'time', 'address', 'details', 'summary',
    //   'table', 'tr', 'td', 'th',
    //   'ul', 'ol', 'li'
    // ];
  
    // this.filterElements(this.doc.body, allowedTags)
  // }

  toggleExpand(item: any): void {
    item.expanded = !item.expanded;
  }


  toggleChildren(item: any) {
    item.showChildren = !item.showChildren
  }

  

  hideLargeImage() {
    this.showImage = false;
    this.enlargedImageUrl = ''
  }

  toggleNavbar() {
    this.isExpanded = !this.isExpanded;
    this.responseData = []
  }

  


  highlightArea(item: any) {
    // console.log(item)
    const height = JSON.parse(this.doc.parentNode.attributes['bounds'].value)['height']
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
    
    let bounds = JSON.parse(item.attributes['bounds'].value)
    let canvas:any = document.getElementById("image");
    let height= JSON.parse(this.doc.parentNode.attributes['bounds'].value)['height']
    let width= JSON.parse(this.doc.parentNode.attributes['bounds'].value)['width']
    let aratioh = parseInt(height)/parseInt(canvas?.offsetHeight)
    let aratiow = parseInt(width)/parseInt(canvas?.offsetWidth)
    let x = 0, y = 0;
 
    if (bounds.left != 0)
      x = bounds.left / divider;
 
    if (bounds.top != 0)
      y = bounds.top / divider;

    // if (this.selDevice.technologyType.toLowerCase() === 'android') {
    
      let spy:any = document.getElementById("box");
      // spy.style.border = "black";
      spy.style.border = "#FF0000";
      spy.style.borderStyle = "solid";
      spy.style.position = "absolute";
      spy.style.height = bounds.height/ aratioh + 7 + "px";
      spy.style.width = bounds.width / aratiow  + "px";
      spy.style.top = (y - 6)+ "px";
      spy.style.left = (x - 2) + "px";
      spy.style.boxShadow = "inset #f7e5e4 0px 0px 60px -12px";
     
  }

  removeHighlight() {
    let box:any = document.getElementById("box");
    box.removeAttribute('style')
  }


  findLeafMostNodesAtPoint2(px: any, py: any, node:any): any {
    let foundInChild: any = false, x: any, y: any, w: any, h: any;
    for (let child of node.children) {
      foundInChild = foundInChild | this.findLeafMostNodesAtPoint2(px, py, child);
    }
    if (foundInChild)
      return true;
    if (node.getAttribute("bounds")) {
      let bounds=  JSON.parse(node.getAttribute("bounds"))
      x = parseInt(bounds.left);
        y = parseInt(bounds.top);
        w = parseInt(bounds.right);
        h = parseInt(bounds.bottom);
      if (x <= px && px <= w && y <= py && py <= h) {
        this.nodes.push(node);
        return true;
      } else {
        return false;
      }
    }
    else
      return false;
  }

  findLeafMostNodesAtPoint(px: any, py: any): any {
    let foundInChild: any = false, x: any, y: any, w: any, h: any;
    for (let child of this.responseData) {
      if (child.component_data.position) {
        x = parseInt(child.component_data.position.column_min);
        y = parseInt(child.component_data.position.row_min);
        w = parseInt(child.component_data.position.column_max);
        h = parseInt(child.component_data.position.row_max);
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


  mousemove(event:any) {
    this.nodes = [];
    let image:any = document.getElementById("image");
    let eleof = image.offsetParent
    let height= JSON.parse(this.doc.parentNode.attributes['bounds'].value)['height']
    let width= JSON.parse(this.doc.parentNode.attributes['bounds'].value)['width']
    let aratioh = parseInt(height)/parseInt(image?.offsetHeight)
    let aratiow = parseInt(width)/parseInt(image?.offsetWidth)
    this.findLeafMostNodesAtPoint2(((event.offsetX-eleof.offsetLeft) * aratiow), ((event.offsetY-eleof.offsetTop)* aratioh),this.doc)
    if(this.nodes.length==0)
      return;
    this.locateNode2(aratioh)
    // else{
    //   let li:any = document.getElementById(this.nodes[0].id)
    //   li.style.border = "#FF0000";
    //   li.style.borderStyle = "solid";
    //   li.style.boxShadow = "inset #f7e5e4 0px 0px 60px -12px";
    // }
        
  }
  selectedNode:any
  myElement:any
  locateNode2(aratio:any){
    this.selectedNode = {};
    let x = 0, y = 0;

    if (Object.keys(this.selectedNode).length == 0)
      this.selectedNode = this.nodes[0];

    for (let i = 0; i < this.nodes.length; i++) {
      let bounds=  JSON.parse(this.selectedNode.getAttribute("bounds"))
      let nbounds=  JSON.parse(this.nodes[i].getAttribute("bounds"))
      if ((bounds.height * bounds.width) > (nbounds.height * nbounds.width)) {
        this.selectedNode = this.nodes[i];
      }
  }
  this.locateNode(aratio,this.selectedNode);
}

  mousedownImg(){
    if(this.myElement)
      this.myElement.click();
    this.myElement = document.getElementById(this.selectedNode?.component_data?.id);
    this.myElement.click();
    this.myElement.scrollIntoView();
  }
 
  toggleAccordion(item: any) {
    item.isExpanded = !item.isExpanded 
  }


}
