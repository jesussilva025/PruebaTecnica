import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, ArrowUpDown } from 'lucide-angular';

import { NavbarComponent } from '../components/navbar.component';
import { ProductListComponent } from '../components/product-list.component';
import { ProductSkeletonComponent } from '../components/product-skeleton.component';
import { EmptyStateComponent } from '../components/empty-state.component';
import { ErrorStateComponent } from '../components/error-state.component';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

type SortMode = 'relevance' | 'price-asc' | 'price-desc';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    NavbarComponent,
    ProductListComponent,
    ProductSkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background text-foreground antialiased">
      <app-navbar />

      <main class="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <section class="mb-10 flex flex-col gap-4 sm:mb-14">
          <span
            class="inline-flex w-fit items-center rounded-full border border-border/70 bg-card px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
          >
            Catálogo · Otoño 2026
          </span>
          <h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Productos con descuentos aplicados automáticamente.
          </h1>
          <p class="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Precios calculados en tiempo real según la categoría. Diseñado para escalar a backend
            propio con AWS Lambda y API Gateway.
          </p>
        </section>

        <section class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="relative w-full sm:max-w-sm">
            <lucide-icon
              [img]="searchIcon"
              class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            ></lucide-icon>
            <input
              type="search"
              [ngModel]="query()"
              (ngModelChange)="query.set($event)"
              placeholder="Buscar productos..."
              class="h-10 w-full rounded-md border border-border/70 bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="flex items-center gap-1 overflow-x-auto rounded-md border border-border/70 bg-card p-1">
              @for (c of categories(); track c) {
                <button
                  type="button"
                  (click)="category.set(c)"
                  class="whitespace-nowrap rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors"
                  [class.bg-foreground]="c === category()"
                  [class.text-background]="c === category()"
                  [class.text-muted-foreground]="c !== category()"
                  [class.hover:text-foreground]="c !== category()"
                >
                  {{ c === 'all' ? 'Todas' : c }}
                </button>
              }
            </div>

            <div class="relative">
              <lucide-icon
                [img]="sortIcon"
                class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              ></lucide-icon>
              <select
                [ngModel]="sort()"
                (ngModelChange)="sort.set($event)"
                class="h-9 appearance-none rounded-md border border-border/70 bg-card pl-8 pr-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio ↑</option>
                <option value="price-desc">Precio ↓</option>
              </select>
            </div>
          </div>
        </section>

        @if (loading()) {
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            @for (i of skeletonRange; track i) {
              <app-product-skeleton />
            }
          </div>
        } @else if (error()) {
          <app-error-state [message]="error()!" (retry)="load()" />
        } @else if (visible().length === 0) {
          <app-empty-state />
        } @else {
          <app-product-list [products]="visible()" />
        }
      </main>

      <footer class="mx-auto max-w-7xl px-6 py-10 text-xs text-muted-foreground">
        <div class="flex flex-col items-start justify-between gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p>© {{ year }} Catálogo. Built for production.</p>
          <p>API: fakestoreapi.com · Listo para migrar a AWS API Gateway</p>
        </div>
      </footer>
    </div>
  `,
})
export class ProductsPageComponent {
  private readonly service = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly query = signal('');
  protected readonly category = signal<string>('all');
  protected readonly sort = signal<SortMode>('relevance');

  protected readonly searchIcon = Search;
  protected readonly sortIcon = ArrowUpDown;
  protected readonly skeletonRange = Array.from({ length: 8 }, (_, i) => i);
  protected readonly year = new Date().getFullYear();

  protected readonly categories = computed(() => {
    const set = new Set(this.products().map((p) => p.category));
    return ['all', ...Array.from(set)];
  });

  protected readonly visible = computed(() => {
    let list = this.products();
    const cat = this.category();
    if (cat !== 'all') list = list.filter((p) => p.category === cat);
    const q = this.query().trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    const s = this.sort();
    if (s === 'price-asc') list = [...list].sort((a, b) => a.finalPrice - b.finalPrice);
    if (s === 'price-desc') list = [...list].sort((a, b) => b.finalPrice - a.finalPrice);
    return list;
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.loading.set(false);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
