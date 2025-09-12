import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridService } from './grid/grid.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  selectedColor = signal('#ff0000');
  colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000'];

  cells: string[] = [];

  gridService = inject(GridService);

  // Create a computed that provides a getter function for better performance
  getCellColor = computed(() => {
    const grid = this.gridService.grid();
    return (cell: string) => grid.get(cell) || '#ffffff';
  });

  constructor() {
    // build grid keys once
    for (let r = 0; r < 100; r++) {
      for (let c = 0; c < 100; c++) {
        this.cells.push(`${r}_${c}`);
      }
    }
  }

  colorCell(cell: string) {
    const [r, c] = cell.split('_').map(Number);
    this.gridService.setCell(r, c, this.selectedColor());
  }

  onColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedColor.set(target.value);
  }
}
