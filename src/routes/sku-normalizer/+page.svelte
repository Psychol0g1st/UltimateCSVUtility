<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import FileExporter from '$lib/components/FileExporter.svelte';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import { dataStore, resetStore } from '$lib/stores/dataStore';
  import { DataTransformer } from '$lib/utils/DataTransformer';
  import { processRow } from '$lib/utils/SKUNormilizer';
  import { onMount } from 'svelte';

  let selectedSkuColumn: string = '';
  let selectedBackupColumn: string = '';
  let isNormalized: boolean = false;

  onMount(() => {
    resetStore();
    // Optionally: console.log('Data store reset on mount');
    // Optionally: console.log('Initial state:', $dataStore);
  });

  function executeNormalization() {
    if (!selectedSkuColumn || !selectedBackupColumn) {
      alert('Please select both SKU column and backup column');
      return;
    }

    // Ensure the new column exists in all rows
    let normalizedData = DataTransformer.addColumnToTable(
      $dataStore.originalData,
      'Régi cikkszám',
      ''
    );

    normalizedData = normalizedData.map((row) => {
      const { normalized, updatedRef, original } = processRow(
        row,
        selectedSkuColumn,
        selectedBackupColumn
      );
      return {
        ...row,
        [selectedSkuColumn]: normalized,
        [selectedBackupColumn]: updatedRef,
        ['Régi cikkszám']: original
      };
    });

    // Update columns list if needed
    let columns = $dataStore.columns;
    if (!columns.includes('Régi cikkszám')) {
      columns = [...columns, 'Régi cikkszám'];
    }

    $dataStore.transformedData = normalizedData;
    $dataStore.columns = columns;
    isNormalized = true;
  }

  function resetNormalization() {
    $dataStore.transformedData = [...$dataStore.originalData];
    isNormalized = false;
  }
</script>

<svelte:head>
  <title>SKU Normalizer | Data Utilities Suite</title>
</svelte:head>

<div class="d-flex flex-column min-vh-100">
  <Header />

  <main class="flex-grow-1">
    <div class="container py-4">
      <div class="mb-4 text-center">
        <h2 class="fw-bold mb-2">
          <i class="bi bi-upc-scan text-primary me-2"></i>
          SKU Normalizer
        </h2>
        <p class="text-muted mb-0">
          Upload your CSV/TSV file, normalize SKU columns, and export the result.
        </p>
      </div>

      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 col-xl-7">
          <FileUploader />
        </div>
      </div>

      {#if $dataStore.originalData.length > 0}
        <div class="row justify-content-center mt-4">
          <div class="col-12 col-lg-8 col-xl-7">
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <h5 class="card-title mb-3">
                  <i class="bi bi-gear me-2"></i>
                  SKU Normalization Settings
                </h5>
                <div class="mb-3">
                  <label for="sku-column" class="form-label fw-semibold">
                    Select SKU Column to Normalize
                  </label>
                  <select id="sku-column" class="form-select" bind:value={selectedSkuColumn}>
                    <option value="">-- Select SKU Column --</option>
                    {#each $dataStore.columns as column}
                      <option value={column}>{column}</option>
                    {/each}
                  </select>
                </div>
                <div class="mb-3">
                  <label for="backup-column" class="form-label fw-semibold">
                    Select Column to Store Original SKU
                  </label>
                  <select id="backup-column" class="form-select" bind:value={selectedBackupColumn}>
                    <option value="">-- Select Backup Column --</option>
                    {#each $dataStore.columns as column}
                      <option value={column}>{column}</option>
                    {/each}
                  </select>
                </div>
                <div class="d-flex gap-2">
                  <button
                    type="button"
                    class="btn btn-primary"
                    disabled={!selectedSkuColumn || !selectedBackupColumn}
                    on:click={executeNormalization}
                  >
                    <i class="bi bi-magic me-1"></i>
                    Execute Normalization
                  </button>
                  {#if isNormalized}
                    <button type="button" class="btn btn-secondary" on:click={resetNormalization}>
                      <i class="bi bi-arrow-counterclockwise me-1"></i>
                      Reset to Original
                    </button>
                  {/if}
                </div>
              </div>
            </div>
            {#if isNormalized}
              <div class="alert alert-success d-flex align-items-center mb-4" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                Normalization completed! SKU column "<strong>{selectedSkuColumn}</strong>" has been
                normalized.
              </div>
            {/if}
            <FileExporter
              data={isNormalized ? $dataStore.transformedData : $dataStore.originalData}
              filename="normalized_sku.csv"
              label={isNormalized ? 'Export Normalized Data' : 'Export Original Data'}
            />
          </div>
        </div>
      {/if}
    </div>
  </main>

  <Footer />
</div>
