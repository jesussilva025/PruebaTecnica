import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductCardComponent } from './product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      @for (p of products(); track p.id) {
        <app-product-card [product]="p" />
      }
    </div>
  `,
})
export class ProductListComponent {
  readonly products = input.required<Product[]>();
}
