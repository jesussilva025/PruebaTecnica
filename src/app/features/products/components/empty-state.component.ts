import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule, PackageOpen } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 bg-card/40 px-6 py-20 text-center"
    >
      <lucide-icon [img]="icon" class="h-8 w-8 text-muted-foreground"></lucide-icon>
      <p class="text-sm font-medium text-foreground">{{ message() }}</p>
      <p class="max-w-sm text-xs text-muted-foreground">
        Intenta ajustar los filtros o vuelve a cargar la página.
      </p>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly message = input<string>('No hay productos para mostrar');
  protected readonly icon = PackageOpen;
}
