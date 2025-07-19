import type { Row, Table } from './CsvParser';

export class DataTransformer {
  static mapColumn(data: Table, column: string, mapFn: (val: string) => string): Table {
    return data.map((row) => ({
      ...row,
      [column]: mapFn(row[column] ?? '')
    }));
  }

  static filterColumns(data: Table, columns: string[]): Table {
    return data.map((row) => Object.fromEntries(columns.map((col) => [col, row[col] ?? ''])));
  }

  static normalizeColumn(data: Table, column: string, normalizeFn: (val: string) => string): Table {
    return this.mapColumn(data, column, normalizeFn);
  }

  static renameColumns(data: Table, originalColumns: string[], newColumns: string[]) {
    if (!data || !originalColumns || !newColumns)
      throw new Error('Invalid parameters for renaming columns');
    return data.map((row) => {
      const newRow: Row = {};
      originalColumns.forEach((col, i) => {
        newRow[newColumns[i] || col] = row[col];
      });
      return newRow;
    });
  }

  static addColumnToTable(
    data: Table,
    column: string,
    defaultValue: string = '',
    forceOverwrite: boolean = false
  ): Table {
    return data.map((row) => ({
      ...row,
      [column]: forceOverwrite || !(column in row) ? defaultValue : row[column]
    }));
  }

  // New data manipulation methods
  static removeRowsByValue(data: Table, column: string, value: string): Table {
    return data.filter((row) => {
      const cellValue = row[column] ?? '';
      return cellValue !== value;
    });
  }

  static removeEmptyRows(data: Table, column: string): Table {
    return data.filter((row) => {
      const cellValue = row[column] ?? '';
      return cellValue.trim() !== '';
    });
  }

  static removeRowsByCondition(
    data: Table,
    column: string,
    condition: (value: string) => boolean
  ): Table {
    return data.filter((row) => {
      const cellValue = row[column] ?? '';
      return !condition(cellValue);
    });
  }

  static replaceInColumn(
    data: Table,
    column: string,
    searchValue: string,
    replaceValue: string
  ): Table {
    return this.mapColumn(data, column, (val) =>
      val.replace(new RegExp(searchValue, 'g'), replaceValue)
    );
  }

  static addPrefixToColumn(data: Table, column: string, prefix: string): Table {
    return this.mapColumn(data, column, (val) => prefix + val);
  }

  static addSuffixToColumn(data: Table, column: string, suffix: string): Table {
    return this.mapColumn(data, column, (val) => val + suffix);
  }

  static removeSubstringFromColumn(data: Table, column: string, substring: string): Table {
    return this.mapColumn(data, column, (val) => val.replace(new RegExp(substring, 'g'), ''));
  }
  static replaceByCondition(
    data: Table,
    column: string,
    condition: string,
    conditionValue: string,
    replacementValue: string
  ): Table {
    return this.mapColumn(data, column, (val) => {
      switch (condition) {
        case 'contains':
          return val.includes(conditionValue) ? replacementValue : val;
        case 'equals':
          return val === conditionValue ? replacementValue : val;
        case 'isEmpty':
          return val.trim() === '' ? replacementValue : val;
        case 'startsWith':
          return val.startsWith(conditionValue) ? replacementValue : val;
        case 'endsWith':
          return val.endsWith(conditionValue) ? replacementValue : val;
        default:
          return val;
      }
    });
  }
  static splitColumnToNewColumns(
    data: Table,
    column: string,
    separator: string,
    removeOriginal: boolean = true
  ): { data: Table; newColumns: string[] } {
    // Find the max number of splits in any row
    const splitCounts = data.map((row) => (row[column] ?? '').split(separator).length);
    const maxSplits = Math.max(...splitCounts);

    // Generate new column names: e.g. "MyCol 1", "MyCol 2", ...
    const newColumns = Array.from({ length: maxSplits }, (_, i) => `${column} ${i + 1}`);

    // Build new data with new columns
    const newData = data.map((row) => {
      const parts = (row[column] ?? '').split(separator);
      const newRow: Row = { ...row };

      // Add new columns
      newColumns.forEach((col, i) => {
        newRow[col] = (parts[i] ?? '').trim();
      });

      // Remove original column if requested
      if (removeOriginal) {
        delete newRow[column];
      }

      return newRow;
    });

    return { data: newData, newColumns };
  }
}
