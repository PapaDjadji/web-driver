import { Component, OnInit } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { DeliveryService } from './delivery-tracking.service';

@Component({
  selector: 'app-delivery-tracking',
  templateUrl: './delivery-tracking.component.html',
  styleUrls: ['./delivery-tracking.component.css']
})
export class DeliveryTrackingComponent implements OnInit {
  deliveryId!: string;
  packageDetails: any;
  deliveryDetails: any;
  currentLocation!: google.maps.LatLngLiteral;
  sourceLocation!: google.maps.LatLngLiteral;
  destinationLocation!: google.maps.LatLngLiteral;
  websocket: WebSocketSubject<any>;

  constructor(private deliveryService: DeliveryService) {
    this.websocket = webSocket('ws://localhost:3011');
  }

  ngOnInit() {
      // Fetch initial data and setup WebSocket listener
      this.websocket.subscribe(
        (message) => this.handleWebSocketMessage(message),
        (error) => console.error(error),
        () => console.warn('WebSocket connection closed')
      );
  }

  handleWebSocketMessage(message: any): void {
    switch (message.event) {
      case 'location_changed':
        if (message.delivery.delivery_id === this.deliveryDetails.delivery_id) {
          this.currentLocation = { lat: message.delivery.location.lat, lng: message.delivery.location.lng };
          this.updateMap(this.currentLocation);
        }
        break;
      case 'status_changed':
        if (message.delivery.delivery_id === this.deliveryDetails.delivery_id) {
          this.deliveryDetails.status = message.status;
          this.updateStatusTimes(message.delivery.status);
        }
        break;
      case 'delivery_updated':
        if (message.delivery.delivery_object.delivery_id === this.deliveryDetails.delivery_id) {
          this.deliveryDetails = message.delivery.delivery_object;
          this.updateMap(this.deliveryDetails.currentLocation);
        }
        break;
    }
  }

  updateStatusTimes(status: string): void {
    const currentTime = new Date().toISOString();
    switch (status) {
      case 'picked-up':
        this.deliveryDetails.pickup_time = currentTime;
        break;
      case 'in-transit':
        this.deliveryDetails.start_time = currentTime;
        break;
      case 'delivered':
      case 'failed':
        this.deliveryDetails.end_time = currentTime;
        break;
    }
  }

  fetchCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        let deliveryId =  this.deliveryDetails.delivery_id;
        const delivery = {deliveryId, location }
        this.updateMap(this.currentLocation);
        // Send WebSocket event to update delivery location
        this.websocket.next({
          event: 'location_update',
          delivery
        });
      },
      (error) => {
        console.error('Error fetching current location:', error);
      }
    );
  }
  

  trackDelivery() {
    this.deliveryService.getDeliveryById(this.deliveryId).subscribe(response => {
      this.packageDetails = response.package_id;
      this.deliveryDetails = response;

      if (this.deliveryDetails) {
        this.sourceLocation = this.packageDetails.from_location;
        this.destinationLocation = this.packageDetails.to_location;
        this.updateMap(this.deliveryDetails.location);
      }
    }, error => {
      console.error('Error tracking package:', error);
    });

    // Fetch current browser location every 20 seconds
    setInterval(() => {
      this.fetchCurrentLocation();
    }, 20000);
  }


  updateMap(location: any): void {
    this.currentLocation = { lat: location.lat, lng: location.lng };
  }

  changeStatus(newStatus: string): void {
    this.deliveryDetails.status = newStatus;
    let delivery_id = this.deliveryDetails.delivery_id
    const delivery = { delivery_id, newStatus};
    this.updateStatusTimes(newStatus);
    this.websocket.next({
      event: 'status_changed',
      delivery
    });
  }


  canChangeStatus(toStatus: string): boolean {
    const statusOrder = ['open', 'picked-up', 'in-transit', 'delivered', 'failed'];
    const currentIndex = statusOrder.indexOf(this.deliveryDetails.status);
    const targetIndex = statusOrder.indexOf(toStatus);
    return targetIndex === currentIndex + 1;
  }

}
