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
  baseData:any

  constructor(
    private route: ActivatedRoute, 
    private apiService: ApiService, 
  ) { }

  ngOnInit(): void {
    this.loadTreeData()
  }

  async loadTreeData() {
    this.flowId = this.route.snapshot.paramMap.get('id');
    const flowData = await this.apiService.getFlow(this.flowId).toPromise();
    if (flowData && flowData.bases.length > 0) {
      let count = 1;
      const firstBase = flowData.bases[0];
      this.baseData=flowData.bases
      const rootNode: TreeNode = { name: count++, children: [], data: firstBase };
      await this.buildTree(rootNode, firstBase._id, count);
      this.treeData = [rootNode];
    }
  }
    
  async buildTree(node: TreeNode, baseId: string, count: number) {
    const interactedObjects = await this.apiService.getComponents(baseId).toPromise();
    const redirectedBaseMap: { [key: string]: TreeNode } = {};
    node.children = await Promise.all(
      interactedObjects.objects.map(async (obj: any) => {
      const objNode: TreeNode = { name: count++, data: obj, children: [] };
      if (obj.redirectedbaseid && obj.redirectedbaseid !== 'None' && baseId!=obj.redirectedbaseid) {
        if (!redirectedBaseMap[obj.redirectedbaseid]) {
          redirectedBaseMap[obj.redirectedbaseid] = {
            name: count++,
            data: null, 
            children: []
          }
          for(let i of this.baseData){
            if(i._id==obj.redirectedbaseid){
              redirectedBaseMap[obj.redirectedbaseid] = {
                name: count++,
                data: i, 
                children: []
              }
            }
          }
          await this.buildTree(redirectedBaseMap[obj.redirectedbaseid], obj.redirectedbaseid, count);
        }
        objNode.children?.push(redirectedBaseMap[obj.redirectedbaseid]);
      }
      return objNode;
      })
    );
  }
    
    openModal(obj:any,base:any,node:any){
      this.showImage=null
      this.baseImage=null
      if(node!=null){
        if(node.data.elementImage){
          this.showImage=this.convertBase64ToImage(node.data.elementImage)
        }
        else{
          this.baseImage=this.convertBase64ToImage(node.data.base)
        }
      }
      else if(base!=null){
        this.baseImage=this.convertBase64ToImage(base[0].data.base)
      }
      else if(obj!=null){
        this.showImage=this.convertBase64ToImage(obj.data.elementImage)
      }
    }

    convertBase64ToImage(base64Data: string): string {
      return 'data:image/jpeg;base64,' + base64Data 
    }
}
