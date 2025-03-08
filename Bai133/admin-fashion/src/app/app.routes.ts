import { Routes } from '@angular/router';
import { FashionListComponent } from './fashion/fashion-list/fashion-list.component';
import { FashionDetailComponent } from './fashion/fashion-detail/fashion-detail.component';
import { FashionFormComponent } from './fashion/fashion-form/fashion-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/fashion', pathMatch: 'full' },
  { path: 'fashion', component: FashionListComponent },
  { path: 'fashion/detail/:id', component: FashionDetailComponent },
  { path: 'fashion/create', component: FashionFormComponent },
  { path: 'fashion/edit/:id', component: FashionFormComponent },
];