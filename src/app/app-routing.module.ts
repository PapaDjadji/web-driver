import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryTrackingComponent } from './delivery-tracking/delivery-tracking.component';

const routes: Routes = [
  { path: '', redirectTo: '/tracking', pathMatch: 'full' },
  { path: 'tracking', component: DeliveryTrackingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
