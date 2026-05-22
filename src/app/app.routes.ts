import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/products/pages/products-page.component').then(
        (m) => m.ProductsPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
