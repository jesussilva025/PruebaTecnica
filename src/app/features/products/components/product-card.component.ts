import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Product } from '../models/product.model';
import { formatMXN } from '../utils/discount.util';

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="group flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)]"
    >
      <div class="relative aspect-square overflow-hidden bg-muted/40">
        @if (hasDiscount()) {
          <span
            class="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background"
          >
            -{{ product().discount }}%
          </span>
        }
        <img
          [src]="product().image"
          [alt]="product().name"
          loading="lazy"
          class="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div class="flex flex-1 flex-col gap-3 p-5">
        <p class="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {{ product().category }}
        </p>
        <h3 class="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {{ product().name }}
        </h3>
        <p class="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {{ product().description }}
        </p>

        <div class="mt-auto flex items-end justify-between pt-3">
          <div class="flex flex-col">
            @if (hasDiscount()) {
              <span class="text-xs text-muted-foreground line-through">{{ originalLabel() }}</span>
            }
            <span class="text-lg font-semibold tracking-tight text-foreground">
              {{ finalLabel() }}
            </span>
          </div>
          @if (hasDiscount()) {
            <span class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Ahorras {{ savingsLabel() }}
            </span>
          }
        </div>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  protected readonly hasDiscount = computed(() => this.product().discount > 0);
  protected readonly originalLabel = computed(() => formatMXN(this.product().price));
  protected readonly finalLabel = computed(() => formatMXN(this.product().finalPrice));
  protected readonly savingsLabel = computed(() =>
    formatMXN(this.product().price - this.product().finalPrice),
  );
}
