<script lang="ts">
  export let columns: string[] = [];
  export let data: Table = [];
  export let onSplit: (result: { data: Table; newColumns: string[] }) => void;

  import { DataTransformer } from '$lib/utils/DataTransformer';
  import type { Table } from '$lib/utils/CsvParser';

  let selectedColumn = '';
  let separator = ', ';
  let removeOriginal = true; // Default to true
  let previewNewColumns: string[] = [];

  // Preview how many columns would be created
  $: if (selectedColumn && data.length) {
    const splitCounts = data.map((row) => (row[selectedColumn] ?? '').split(separator).length);
    const maxSplits = Math.max(...splitCounts);
    previewNewColumns = Array.from({ length: maxSplits }, (_, i) => `${selectedColumn} ${i + 1}`);
  } else {
    previewNewColumns = [];
  }

  function handleSplit() {
    if (!selectedColumn || !separator) return;
    const result = DataTransformer.splitColumnToNewColumns(
      data,
      selectedColumn,
      separator,
      removeOriginal
    );
    onSplit(result);
  }
</script>

<div class="card shadow-sm mb-3">
  <div class="card-body">
    <h5 class="card-title mb-3">Oszlop szétbontása új oszlopokra</h5>
    <form autocomplete="off" on:submit|preventDefault={handleSplit}>
      <div class="mb-3">
        <label class="form-label fw-semibold" for="split-col-select"
          >Oszlop kiválasztása bontáshoz</label
        >
        <select id="split-col-select" class="form-select" bind:value={selectedColumn}>
          <option value="">-- Válasszon oszlopot --</option>
          {#each columns as col}
            <option value={col}>{col}</option>
          {/each}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold" for="split-sep-input">Elválasztó karakter</label>
        <input
          id="split-sep-input"
          type="text"
          class="form-control"
          bind:value={separator}
          placeholder="pl. , vagy ; vagy |"
        />
      </div>
      <div class="mb-3">
        <div class="form-check">
          <input
            id="remove-original-check"
            type="checkbox"
            class="form-check-input"
            bind:checked={removeOriginal}
          />
          <label class="form-check-label" for="remove-original-check">
            Eredeti oszlop eltávolítása bontás után
          </label>
        </div>
      </div>
      {#if previewNewColumns.length > 0}
        <div class="mb-3">
          <div class="alert alert-info py-2">
            <i class="bi bi-columns-gap me-1"></i>
            {previewNewColumns.length} új oszlop jön létre:
            <span class="fw-semibold">{previewNewColumns.join(', ')}</span>
            {#if !removeOriginal}
              <br /><small class="text-muted">Az eredeti "{selectedColumn}" oszlop megmarad.</small>
            {/if}
          </div>
        </div>
      {/if}
      <button type="submit" class="btn btn-primary" disabled={!selectedColumn || !separator}>
        <i class="bi bi-scissors me-1"></i>
        Oszlop szétbontása
      </button>
    </form>
  </div>
</div>
