import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule, Moon, Sun, Sparkles } from 'lucide-angular';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" class="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span class="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
            <lucide-icon [img]="sparkles" class="h-4 w-4"></lucide-icon>
          </span>
          <span>Catálogo</span>
          <span class="text-muted-foreground font-normal">/ Productos</span>
        </a>
        <button
          type="button"
          (click)="theme.toggle()"
          aria-label="Cambiar tema"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
        >
          <lucide-icon [img]="theme.isDark() ? sun : moon" class="h-4 w-4"></lucide-icon>
        </button>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly moon = Moon;
  protected readonly sun = Sun;
  protected readonly sparkles = Sparkles;
}
