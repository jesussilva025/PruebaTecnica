import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
      <div class="aspect-square animate-pulse bg-muted/60"></div>
      <div class="flex flex-col gap-3 p-5">
        <div class="h-2 w-16 animate-pulse rounded bg-muted"></div>
        <div class="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
        <div class="h-3 w-full animate-pulse rounded bg-muted"></div>
        <div class="h-3 w-2/3 animate-pulse rounded bg-muted"></div>
        <div class="mt-4 h-6 w-1/3 animate-pulse rounded bg-muted"></div>
      </div>
    </div>
  `,
})
export class ProductSkeletonComponent {}
