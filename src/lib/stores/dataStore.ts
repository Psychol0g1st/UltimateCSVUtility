import { writable } from 'svelte/store';
import type { Delimiter, Table } from '$lib/utils/CsvParser';

export interface DataState {
  originalData: Table;
  transformedData: Table;
  columns: string[];
  delimiter: Delimiter;
  filename: string;
}

const initialState: DataState = {
  originalData: [],
  transformedData: [],
  columns: [],
  delimiter: ',',
  filename: ''
};

export const dataStore = writable<DataState>(initialState);

export function resetStore(): void {
  dataStore.set(initialState);
}

export function updateData(
  data: Table,
  columns: string[],
  delimiter: Delimiter,
  filename: string
): void {
  dataStore.update((state) => ({
    ...state,
    originalData: data,
    transformedData: data,
    columns,
    selectedColumns: [...columns], // Initialize with all columns
    delimiter,
    filename
  }));
}
