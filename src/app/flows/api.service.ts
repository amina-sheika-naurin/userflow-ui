import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://159.65.152.145:5700/api/';

  constructor(private http: HttpClient) { }

  getAllFlows(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'get-all-simulations');
  }

  getFlow(flowId: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'get-simulation?simulationid=' + flowId);
  }

  getComponents(id: string):  Observable<any> {
    return this.http.get<any>(this.baseUrl + 'get-userInteracted-objects?baseid=' + id);
  }

}
