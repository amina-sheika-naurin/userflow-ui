import { Component } from '@angular/core' 
import { ActivatedRoute } from '@angular/router' 
import { ApiService } from '../api.service' 
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-single-flow',
  templateUrl: './single-flow.component.html',
  styleUrl: './single-flow.component.css'
})
export class SingleFlowComponent {
  showLoader:boolean= false
  interactedobjects:any
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
  isPlaying: boolean = false;
  showImage: boolean = false 
  enlargedImageUrl: string = '' 
  currentImageIndex: number = 0
  currentImageSrc: string = '';
  playInterval: any;
  imageHeight:any
  isSimulating: boolean = false
  simulationInterval: any;
  actionPayload:any;

  

  constructor(
    private route: ActivatedRoute, 
    private apiService: ApiService, 
  ) { }

  ngOnInit(): void {
    this.showLoader = true
    const flowId = this.route.snapshot.paramMap.get('id') 
    if (flowId) {
      this.apiService.getFlow(flowId).subscribe
      ({
        next: (resp: any) => {
          this.flowData = resp.bases
          this.showLargeImage(this.flowData[0]._id, this.flowData[0].base, this.flowData[0].html);
          this.imageHeight = JSON.parse(this.doc.parentNode.attributes['bounds'].value)['height'];
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

  
  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.showImage = false;
      this.playflow(); 
      this.playInterval = setInterval(() => {
        this.playflow(); 
      }, 1500);
    } else {
      if (this.playInterval) {
        clearInterval(this.playInterval);
      }
      this.showImage = true;
    }
  }


  playflow() {
    if (this.currentImageIndex < this.flowData.length) {
      this.currentImageSrc = 'data:image/jpeg;base64,' + this.flowData[this.currentImageIndex].base;
      this.updateInteractedObjects(this.flowData[this.currentImageIndex]._id);
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
      this.currentImageSrc = this.flowData[this.currentImageIndex].base;
      this.updateInteractedObjects(this.flowData[this.currentImageIndex]._id);
    }
  }

  toggleSimulate() {
    this.isSimulating = !this.isSimulating
    if (this.isSimulating) {
      this.launchUrl()
    }
    else{
      this.closeDriver()
    }
  }

  closeDriver(){
    this.apiService.closeDriver().subscribe({
      next: (resp: any) =>{
        console.log(resp)
      },
      error(err){
        console.error('Error closing driver:', err);
      },
    })
  }
  
  // async launchUrl() {
  //   try {
  //     const launchResp = await this.apiService.launchUrl(this.flowData[0].page_URL).toPromise()
  //     console.log('Launch URL response:', launchResp)

      
  
  //     for (let i = 0; i < this.flowData.length; i++) {
  //       let item = this.flowData[i];
  //       console.log(`Processing item with ID: ${item._id}`)
  
  //       try {
  //         let compResp = await this.apiService.getComponents(item._id).toPromise()
  //         console.log('Components response:', compResp)
  
  //         if (compResp.objects.length>0) {
  //           let bounds = compResp.objects[0].objectbounds
  //           console.log('Component bounds:', bounds)
  
  //           this.actionPayload = {
  //             "top": bounds.top,
  //             "right": bounds.right,
  //             "left": bounds.left,
  //             "bottom": bounds.bottom,
  //             "height": JSON.parse(this.doc.parentNode.attributes['bounds'].value)['height'],
  //             "width": JSON.parse(this.doc.parentNode.attributes['bounds'].value)['width'],
  //             "inputtext" : compResp.objects[0].inputText
  //           };
  
  //           console.log('Action payload:', this.actionPayload)
  //         } else {
  //           console.warn('No objects found in components response.')
  //         }
  //         this.showLoader = false
  
  //         const actionResp = await this.apiService.performAction(this.actionPayload).toPromise()
  //         console.log('Perform action response:', actionResp)
  
  //       } catch (compError) {
  //         console.error('Error fetching components or performing action:', compError)
  //       }
  //     }
  
  //   } catch (launchError) {
  //     console.error('Error launching URL:', launchError)
  //   }
  // }

  async launchUrl() {
    // Helper function to create a delay
    const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      const launchResp = await this.apiService.launchUrl(this.flowData[0].page_URL).toPromise();
      console.log('Launch URL response:', launchResp);
    
      for (let i = 0; i < this.flowData.length; i++) {
        if (!this.isSimulating) {
          console.log('Simulation is false. Terminating the loop.');
          break; // Exit the loop
      }

        let item = this.flowData[i];
        // console.log(`Processing item with ID: ${item._id}`);
    
        try {
          let compResp = await this.apiService.getComponents(item._id).toPromise();
          // console.log('Components response:', compResp);
    
          if (compResp.objects.length > 0) {
            let bounds = compResp.objects[0].objectbounds;
            // console.log('Component bounds:', bounds);
    
            this.actionPayload = {
              "top": bounds.top,
              "right": bounds.right,
              "left": bounds.left,
              "bottom": bounds.bottom,
              "height": JSON.parse(this.doc.parentNode.attributes['bounds'].value)['height'],
              "width": JSON.parse(this.doc.parentNode.attributes['bounds'].value)['width'],
              "inputtext": compResp.objects[0].inputText
            };
    
            console.log('Action payload:', this.actionPayload);
          } else {
            console.warn('No objects found in components response.');
          }
          this.showLoader = false;
    
          const actionResp = await this.apiService.performAction(this.actionPayload).toPromise();
          console.log('Perform action response:', actionResp);
    
        } catch (compError) {
          console.error('Error fetching components or performing action:', compError);
        }
    
        // Delay before processing the next item
        await delay(3000); // 1500 milliseconds = 1.5 seconds
    
      }
    
    } catch (launchError) {
      console.error('Error launching URL:', launchError);
    }
  }
  
  
  
  

  updateInteractedObjects(baseid: any) {
    this.apiService.getComponents(baseid).subscribe({
      next: (resp: any) => {
        if(resp.objects.length>0){
          this.highlightPlayInteractedObjects(resp.objects);
        }
        this.showLoader = false;
      },
      error(err) {
        console.error('Error fetching components:', err);
      },
    })
  }

  highlightPlayInteractedObjects(interactedobjects: any) {
    // const imageHeight = JSON.parse(this.doc.parentNode.attributes['bounds'].value)['height'];
    let image: any = document.getElementById("play-image");
    let aratio = parseInt(this.imageHeight) / parseInt(image?.offsetHeight);
  
    let bounds = interactedobjects[0].objectbounds;
  
    let canvas: any = document.getElementById("play-image");
    let height = JSON.parse(this.doc.parentNode.attributes['bounds'].value)['height'];
    let width = JSON.parse(this.doc.parentNode.attributes['bounds'].value)['width'];
    let aratioh = parseInt(height) / parseInt(canvas?.offsetHeight);
    let aratiow = parseInt(width) / parseInt(canvas?.offsetWidth);
  
    let x = 0, y = 0;
  
    if (bounds.left != 0) x = bounds.left / aratio;
    if (bounds.top != 0) y = bounds.top / aratio;
  
    let spy: any = document.getElementById("play-interactedbox");
    let description: any = document.getElementById("play-description");
  
    spy.style.border = "#008000";
    spy.style.borderStyle = "solid";
    spy.style.position = "absolute";
    spy.style.height = bounds.height / aratioh + 7 + "px";
    spy.style.width = bounds.width / aratiow + "px";
    spy.style.top = (y - 6) + "px";
    spy.style.left = (x - 2) + "px";
  
    description.style.position = "absolute";
    const descWidth = description.offsetWidth;
    const descHeight = description.offsetHeight;

    let descX = x - 2;
    let descY = y - 6 - descHeight - 10; // Default to above the interactedbox
  
    // if description goes out of bounds
    if (descX < 0) descX = 0; // Prevent going out of left side
    if (descX + descWidth > canvas.offsetWidth) descX = canvas.offsetWidth - descWidth; // Prevent going out of right side
  
    if (descY < 0) descY = y + bounds.height / aratioh + 10; // Position below if going out of top
    if (descY + descHeight > canvas.offsetHeight) descY = canvas.offsetHeight - descHeight; // Prevent going out of bottom
  
    const interactedboxRect = spy.getBoundingClientRect();    
    if (descY + descHeight > interactedboxRect.top) {
      descY = interactedboxRect.top - descHeight + 70; // Position above if overlapping
    }
  
    description.style.left = descX + "px";
    description.style.top = descY + "px";
    description.innerText = interactedobjects[0].description;
  }
  

  showLargeImage(baseid:any,imageUrl: any, html: string) {
    this.showImage = true 
    // this.isExpanded = false 
    this.enlargedImageUrl = imageUrl 
    this.maketree(html)
    this.showLoader = true
    this.apiService.getComponents(baseid).subscribe({
      next: (resp: any) => {
        this.interactedobjects = resp.objects
        this.highlightInteractedObjects(this.interactedobjects)
        // this.responseData = resp.components
        this.showLoader = false
      },
      error(err){
      },
    })
  }
  
  highlightInteractedObjects(interactedobjects: any) {
    // const imageHeight = JSON.parse(this.doc.parentNode.attributes['bounds'].value)['height'];
    let image: any = document.getElementById("image");
    let aratio = parseInt(this.imageHeight) / parseInt(image?.offsetHeight);
  
    let bounds = interactedobjects[0].objectbounds;
  
    let canvas: any = document.getElementById("image");
    let height = JSON.parse(this.doc.parentNode.attributes['bounds'].value)['height'];
    let width = JSON.parse(this.doc.parentNode.attributes['bounds'].value)['width'];
    let aratioh = parseInt(height) / parseInt(canvas?.offsetHeight);
    let aratiow = parseInt(width) / parseInt(canvas?.offsetWidth);
  
    let x = 0, y = 0;
  
    if (bounds.left != 0) x = bounds.left / aratio;
    if (bounds.top != 0) y = bounds.top / aratio;
  
    let spy: any = document.getElementById("interactedbox");
  
    spy.style.border = "#008000";
    spy.style.borderStyle = "solid";
    spy.style.position = "absolute";
    spy.style.height = bounds.height / aratioh + 7 + "px";
    spy.style.width = bounds.width / aratiow + "px";
    spy.style.top = (y - 6) + "px";
    spy.style.left = (x - 2) + "px";
  }
  
  
  redirect(){
    let redirectionbaseid = this.interactedobjects[0].redirectedbaseid
    let matchingObject = this.flowData.find((obj: { _id: any }) => obj._id === redirectionbaseid);
    this.showLargeImage(matchingObject._id,matchingObject.base, matchingObject.html)
    this.convertBase64ToImage(matchingObject.base)
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
    //  let allowedTags = [
    //   'body','div', 'span', 'section', 'article', 'header', 'footer', 'nav', 'aside', 'main',
    //   'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'a',
    //   'img', 'audio', 'video',
    //   'button', 'form', 'input', 'label', 'select', 'textarea',
    //   'figure', 'figcaption', 'time', 'address', 'details', 'summary',
    //   'table', 'tr', 'td', 'th',
    //   'ul', 'ol', 'li', 'dialog', 'center'
    // ];
    const parser = new DOMParser()
    const parsedDoc = parser.parseFromString(html, 'text/html')
    this.doc = parsedDoc.body
    // this.doc =  this.filterElements(parsedDoc.body, allowedTags) 
  }


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
