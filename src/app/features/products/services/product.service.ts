import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_CONFIG } from '@core/config/api.config';
import { ApiProduct, Product } from '../models/product.model';
import {
  calculateFinalPrice,
  getDiscountForCategory,
} from '../utils/discount.util';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}`;
    return this.http.get<ApiProduct[]>(url).pipe(map((list) => list.map(this.toProduct)));
  }

  private toProduct(raw: ApiProduct): Product {
    const discount = getDiscountForCategory(raw.category);
    return {
      id: raw.id,
      name: raw.title,
      price: raw.price,
      category: raw.category,
      image: raw.image,
      description: raw.description,
      discount,
      finalPrice: calculateFinalPrice(raw.price, discount),
    };
  }
}
