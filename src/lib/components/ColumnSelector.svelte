<script lang="ts">
  export let columns: string[] = [];
  export let selectedColumns: string[] = [];

  import { onMount } from 'svelte';
  onMount(() => {
    if (selectedColumns.length === 0 && columns.length > 0) {
      selectedColumns = [...columns];
    }
  });

  function toggleColumn(col: string, checked: boolean) {
    if (checked) {
      if (!selectedColumns.includes(col)) {
        selectedColumns = [...selectedColumns, col];
      }
    } else {
      selectedColumns = selectedColumns.filter((c) => c !== col);
    }
  }

  function selectAll() {
    selectedColumns = [...columns];
  }

  function deselectAll() {
    selectedColumns = [];
  }

  $: allSelected = selectedColumns.length === columns.length;
  $: noneSelected = selectedColumns.length === 0;
</script>

<div class="card shadow-sm mb-3">
  <div class="card-body">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="card-title mb-0">
        <i class="bi bi-list-check text-primary me-2"></i>
        Oszlopok kiválasztása
      </h5>
      <span class="badge bg-secondary">
        {selectedColumns.length} / {columns.length}
      </span>
    </div>

    <!-- Action Buttons -->
    <div class="d-flex gap-2 mb-3">
      <button
        type="button"
        class="btn btn-outline-primary btn-sm"
        on:click={selectAll}
        disabled={allSelected}
      >
        <i class="bi bi-check-all me-1"></i>
        Összes kijelölése
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        on:click={deselectAll}
        disabled={noneSelected}
      >
        <i class="bi bi-x-square me-1"></i>
        Összes elvetése
      </button>
    </div>

    <!-- Column Checkboxes -->
    <div class="row g-2" style="max-height: 300px; overflow-y: auto;">
      {#each columns as col}
        <div class="col-12 col-md-6">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="col-{col}"
              bind:group={selectedColumns}
              value={col}
              checked={selectedColumns.includes(col)}
              on:change={(e) => {
                const target = e.target as HTMLInputElement | null;
                if (target) toggleColumn(col, target.checked);
              }}
            />
            <label class="form-check-label text-truncate" for="col-{col}" title={col}>
              {col}
            </label>
          </div>
        </div>
      {/each}
    </div>

    <!-- Empty State -->
    {#if columns.length === 0}
      <div class="text-muted text-center py-3">
        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
        Nincs elérhető oszlop
      </div>
    {/if}
  </div>
</div>
