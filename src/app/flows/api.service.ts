import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private flaskURL = 'http://159.65.152.145:5200/api/';
  private nettyURL = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders().set('Content-Type', 'application/json')

  getAllFlows(): Observable<any> {
    return this.http.get<any>(this.flaskURL + 'get-all-simulations');
  }

  getFlow(flowId: string): Observable<any> {
    return this.http.get<any>(this.flaskURL + 'get-simulation?simulationid=' + flowId);
  }

  getComponents(id: string):  Observable<any> {
    return this.http.get<any>(this.flaskURL + 'get-userInteracted-objects?baseid=' + id);
  }

  launchUrl(url: string): Observable<any> {
    return this.http.get<any>(this.nettyURL + 'launchUrl?url=' + url)
  }


  performAction(payload:any): Observable<any> {
    return this.http.post(this.nettyURL+"performAction",payload );
  }

  closeDriver(): Observable<any> {
    return this.http.get(this.nettyURL+"closeDriver");
  }



}
