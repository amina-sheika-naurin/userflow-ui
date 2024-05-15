import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api/';

  constructor(private http: HttpClient) { }

  getAllFlows(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'getallflows');
  }

  getFlow(flowId: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'getflow?flow_id=' + flowId);
  }

  getComponents(id: string):  Observable<any> {
    return this.http.get<any>(this.baseUrl + 'getcomponents?baseimage_id=' + id);
  }

}
