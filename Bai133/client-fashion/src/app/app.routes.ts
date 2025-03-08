import { Routes } from '@angular/router';
import { FashionListComponent } from './components/fashion-list/fashion-list.component';
import { FashionDetailComponent } from './components/fashion-detail/fashion-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'fashion', pathMatch: 'full' },
  { path: 'fashion', component: FashionListComponent },
  { path: 'fashion/:id', component: FashionDetailComponent },
  { path: '**', redirectTo: 'fashion' }
];