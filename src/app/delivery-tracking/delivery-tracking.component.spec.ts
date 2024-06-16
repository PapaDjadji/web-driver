import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTrackingComponent } from './delivery-tracking.component';

describe('DeliveryTrackingComponent', () => {
  let component: DeliveryTrackingComponent;
  let fixture: ComponentFixture<DeliveryTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryTrackingComponent]
    });
    fixture = TestBed.createComponent(DeliveryTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
