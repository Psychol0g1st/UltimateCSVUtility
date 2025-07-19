### CSV/TSV Transform Utility

A web-based tool for uploading, transforming, and exporting CSV/TSV files, built with SvelteKit and TypeScript.  
All processing is done client-side, ensuring privacy and speed.

---

#### **Features**

- Upload CSV or TSV files (UTF-8 encoding)
- View and edit tabular data in-browser
- Transform data:
  - Map or normalize column values
  - Filter to specific columns
- Export transformed data as CSV or TSV

---

#### **Project Structure**

```
/src
  /lib
    /utils
      CsvParser.ts         // Parsing and stringifying CSV/TSV
      DataTransformer.ts   // Data transformation utilities
      FileExporterer.ts      // Exporting files for download
    /components
      FileUploader.svelte  // File upload UI
      DataTable.svelte     // Table display UI
      DelimeterSelect.svelte // Delimiter selection dropdown
      FileExporter.svelte  // Export/download button
    /stores
      dataStore.ts         // Svelte store for app state
  /routes
    +page.svelte           // Main app page, here user can select utility, which they want to use.
    column-selector/
      +page.svelte         // Column Selector utility page
/static
  (static assets)
```

---

#### **Core Types**

```ts
// src/lib/utils/CsvParser.ts
export type Delimiter = ',' | '\t' | ';' | '|' | ' ';
export type Row = Record<string, string>;
export type Table = Row[];
```

---

#### **Key Utilities**

- **CsvParser**
  - `parse(text: string, delimiter: Delimiter): Table`  
    Parses CSV/TSV text into a table (array of row objects).
  - `stringify(data: Table, delimiter: Delimiter): string`  
    Converts a table back to CSV/TSV text.

- **DataTransformer**
  - `mapColumn(data: Table, column: string, mapFn: (val: string) => string): Table`  
    Applies a function to every value in a column.
  - `filterColumns(data: Table, columns: string[]): Table`  
    Keeps only specified columns.
  - `normalizeColumn(data: Table, column: string, normalizeFn: (val: string) => string): Table`  
    Normalizes values in a column.

- **FileExporter**
  - `export(data: string, filename: string): void`  
    Triggers a download of the given data as a file (UTF-8) with selected separator.

---

#### **State Management**

- **dataStore.ts**  
  Svelte store holding:
  - `originalData`: Table (raw upload)
  - `transformedData`: Table (after transforms)
  - `columns`: string[] (current columns)
  - `delimiter`: Delimiter (',' or '\t')
  - `filename`: string (original file name)

---

#### **Component Overview**

- **FileUploader.svelte**  
  Handles file input, specifying the delimeter, reads as UTF-8, parses, and updates store.

- **DataTable.svelte**  
  Displays the current table (transformed data).

- **FileExporter.svelte**  
  Exports the data as CSV or TSV with selected separator.

---

#### **How to Use**

1. **Upload** a CSV or TSV file (UTF-8).
2. **View** the data in the table.
3. **Transform**:
   - Map or normalize columns (e.g., change case, trim, custom logic).
   - Filter to keep only desired columns.
4. **Export** the result as a new CSV or TSV file.

---

#### **Development**

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the dev server:**

   ```bash
   npm run dev
   ```

3. **Open** [http://localhost:5173](http://localhost:5173) (or the port shown).

---

#### **Customization**

- Add new transformation functions in `DataTransformer.ts`.
- Extend the UI in `TransformPanel.svelte` for more advanced transforms.
- Adjust styling in `+layout.svelte` or add custom CSS.

---

#### **Notes**

- All file operations use UTF-8 encoding.
- No data is sent to a server; everything runs in the browser.
- Large files may be limited by browser memory.

---

### Prompt context

SvelteKit + TypeScript CSV/TSV transform utility. Client-side only, UTF-8 encoding.
Tech Stack: SvelteKit, Svelte 6 in runes mode with TypeScript, Bootstrap 5.3 CSS, Svelte stores for state management
Code Rules: No any types - use explicit typing
