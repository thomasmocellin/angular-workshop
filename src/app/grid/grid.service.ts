import { Injectable, signal } from '@angular/core';
import { Database, ref, set, onChildChanged, onChildAdded, get } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class GridService {
  // A signal that holds the current grid as a Map
  private _grid = new Map<string, string>();
  grid = signal<Map<string, string>>(this._grid);

  constructor(private db: Database) {
    this.loadInitialGrid();
    this.listenToGridChanges();
  }

  async setCell(row: number, col: number, color: string) {
    const key = `${row}_${col}`;

    // Optimistic update: immediately update local grid
    this._grid.set(key, color);
    this.grid.set(new Map(this._grid)); // Create new Map instance to trigger signal update

    // Then sync to Firebase
    try {
      await set(ref(this.db, `grid/${key}`), color);
    } catch (error) {
      // On error, we could revert the optimistic update
      // For now, Firebase will sync the correct state via listeners
      console.error('Failed to update cell:', error);
    }
  }

  private async loadInitialGrid() {
    const snapshot = await get(ref(this.db, 'grid'));
    const data = snapshot.val() || {};

    // Clear and populate the existing map instead of creating new one
    this._grid.clear();
    Object.entries(data).forEach(([key, value]) => {
      this._grid.set(key, value as string);
    });

    this.grid.set(new Map(this._grid)); // Create new Map instance to trigger signal update
  }

  private listenToGridChanges() {
    const gridRef = ref(this.db, 'grid');

    // Handle both new cells and updated cells
    const updateCell = (snap: any) => {
      const key = snap.key!;
      const color = snap.val();

      // Mutable update: directly modify the existing map
      this._grid.set(key, color);
      this.grid.set(new Map(this._grid)); // Create new Map instance to trigger signal update
    };

    onChildAdded(gridRef, updateCell);
    onChildChanged(gridRef, updateCell);
  }
}
