import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router' 
import { ApiService } from '../api.service' 

interface TreeNode {
  name: any;
  data:any;
  children?: TreeNode[];
}

@Component({
  selector: 'app-tree-flow',
  templateUrl: './tree-flow.component.html',
  styleUrl: './tree-flow.component.css'
})
export class TreeFlowComponent {

  showLoader:boolean= false
  flowData:any
  userObject:any
  flowId:any
  interactedobjects:any
  treeData: TreeNode[] = []
  showImage:any
  baseImage:any

  constructor(
    private route: ActivatedRoute, 
    private apiService: ApiService, 
  ) { }

  ngOnInit(): void {
    this.loadTreeData()
  }

    async loadTreeData() {
      this.flowId = this.route.snapshot.paramMap.get('id')
      await this.apiService.getFlow(this.flowId).subscribe({
        next: (resp: any) => {
          let count=1
          const rootNode: TreeNode = { name: count++, children: [], data:[] }
          const flowData = resp.bases
          
          const baseNodes = flowData.map((base: any) => {
            const baseNode: TreeNode = { name: count++, children: [], data: base }
  
            this.apiService.getComponents(base._id).subscribe({
              next: (resp: any) => {
                const interactedObjects = resp.objects
                baseNode.children = interactedObjects.map((obj: any) => ({
                  name: count++,
                  data: obj
                }));
              }
            });
            return baseNode
          });
  
          rootNode.children = baseNodes
          this.treeData = [rootNode]
        }
      });
    }

    openModal(obj:any,base:any){
      this.showImage=this.convertBase64ToImage(obj.data.elementImage)
      this.baseImage=this.convertBase64ToImage(base.data.base)
    }

    convertBase64ToImage(base64Data: string): string {
      return 'data:image/jpeg;base64,' + base64Data 
    }
}
