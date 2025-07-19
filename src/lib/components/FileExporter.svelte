<script lang="ts">
  import { CsvParser, type Delimiter, type Table } from '$lib/utils/CsvParser';
  import { FileExporterer } from '$lib/utils/FileExporter';
  import DelimeterSelect from './DelimeterSelect.svelte';

  export let data: Table = [];
  export let delimiter: Delimiter = '\t';
  export let filename: string = 'export.csv';
  export let label: string = 'Exportálás';

  function handleExport() {
    if (!data.length) return;
    const csvText = CsvParser.stringify(data, delimiter);
    FileExporterer.export(csvText, filename);
  }
</script>

<div class="card shadow-sm mb-4">
  <div class="card-body">
    <div class="d-flex flex-column flex-md-row align-items-md-end gap-3">
      <div>
        <label class="form-label fw-semibold mb-1">Elválasztójel</label>
        <DelimeterSelect bind:delimiter />
      </div>
      <div class="flex-grow-1"></div>
      <button
        class="btn btn-success px-4"
        on:click={handleExport}
        disabled={!data.length}
        aria-disabled={!data.length}
        type="button"
      >
        <i class="bi bi-download me-2"></i>
        {label}
      </button>
    </div>
    {#if !data.length}
      <div class="form-text text-danger mt-2">
        <i class="bi bi-exclamation-circle me-1"></i>
        Nincs exportálható adat.
      </div>
    {/if}
  </div>
</div>
