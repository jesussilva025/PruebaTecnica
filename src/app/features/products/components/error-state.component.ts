import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, AlertTriangle, RotateCw } from 'lucide-angular';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-20 text-center"
    >
      <lucide-icon [img]="warning" class="h-8 w-8 text-destructive"></lucide-icon>
      <div class="space-y-1">
        <p class="text-sm font-medium text-foreground">{{ message() }}</p>
        <p class="text-xs text-muted-foreground">Verifica tu conexión e inténtalo de nuevo.</p>
      </div>
      <button
        type="button"
        (click)="retry.emit()"
        class="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90"
      >
        <lucide-icon [img]="rotate" class="h-3.5 w-3.5"></lucide-icon>
        Reintentar
      </button>
    </div>
  `,
})
export class ErrorStateComponent {
  readonly message = input<string>('Ocurrió un error al cargar los productos');
  readonly retry = output<void>();
  protected readonly warning = AlertTriangle;
  protected readonly rotate = RotateCw;
}
