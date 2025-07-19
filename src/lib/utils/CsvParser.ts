export type Delimiter = ',' | '\t' | ';' | '|' | ' ';
export type Row = Record<string, string>;
export type Table = Row[];

export class CsvParser {
  static parse(text: string, delimiter: Delimiter = ','): Table {
    const [header, ...rows] = text.split('\n');
    // Trim all header keys to remove whitespace and \r
    let keys = header.split(delimiter).map((k) => k.trim());
    // Assign default names to empty headers
    keys = keys.map((k, i) => (k !== '' ? k : `Oszlop${i + 1}`));

    return rows.map((row) => {
      const values = row.split(delimiter);
      const obj: Row = {};
      keys.forEach((k, i) => {
        obj[k] = (values[i] ?? '').replace(/\r$/, ''); // Also trim \r from values
      });
      return obj;
    });
  }

  static stringify(data: Table, delimiter: Delimiter = ','): string {
    if (!data.length) return '';
    const keys = Object.keys(data[0]);
    const header = keys.join(delimiter);
    const rows = data.map((row) => keys.map((k) => row[k] ?? '').join(delimiter));
    return [header, ...rows].join('\n');
  }
}
