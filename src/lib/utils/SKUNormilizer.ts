import type { Row } from './CsvParser';

function removeAccents(str: string): string {
  return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizaltCikkszam(rawSku: string): string {
  if (typeof rawSku !== 'string') return '';
  let normalized = removeAccents(rawSku);
  normalized = normalized.trim();
  normalized = normalized.replace(/ /g, '_');
  normalized = normalized.replace(/,/g, '_');
  normalized = normalized.replace(/\./g, '_');
  normalized = normalized.replace(/\//g, '-');
  normalized = normalized.replace(/=/g, '-');
  normalized = normalized.replace(/"/g, '');
  normalized = normalized.replace(/\(/g, '');
  normalized = normalized.replace(/\)/g, '');
  normalized = normalized.replace(/[^A-Za-z0-9_-]/g, '');
  return normalized;
}

export function processRow(
  row: Row,
  skuCol: string,
  refCol: string
): { normalized: string; updatedRef: string; original: string } {
  const original = String(row[skuCol] ?? '').trim();
  let backup = String(row[refCol] ?? '').trim();

  if (original !== '') {
    const normalized = normalizaltCikkszam(original);
    if (normalized !== original) {
      backup = backup ? `${backup}, ${original}` : original;
      return { normalized, updatedRef: backup, original };
    } else {
      return { normalized: original, updatedRef: backup, original: '' };
    }
  } else {
    return { normalized: original, updatedRef: backup, original };
  }
}
