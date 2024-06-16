import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'http://localhost:3010/api';

  constructor(private http: HttpClient) { }

  getPackageById(packageId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/delivery/${packageId}`);
  }

  getDeliveryById(deliveryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/delivery/${deliveryId}`);
  }
}
