<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import FileExporter from '$lib/components/FileExporter.svelte';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import { dataStore, resetStore } from '$lib/stores/dataStore';
  import type { Table } from '$lib/utils/CsvParser';
  import DataManipulationSelector from '$lib/components/DataManipulation/DataManipulationSelector.svelte';

  let manipulatedData = $state<Table>([]);
  let hasManipulation = $state(false);

  let originalRowCount = $derived($dataStore.originalData.length);
  let manipulatedRowCount = $derived(manipulatedData.length);
  let rowDifference = $derived(originalRowCount - manipulatedRowCount);
  let modifiedRowCount = $derived.by(() => {
    if ($dataStore.originalData.length === manipulatedData.length && manipulatedData.length > 0) {
      let count = 0;
      for (let i = 0; i < manipulatedData.length; i++) {
        const orig = $dataStore.originalData[i];
        const manip = manipulatedData[i];
        for (const col of $dataStore.columns) {
          if ((orig?.[col] ?? '') !== (manip?.[col] ?? '')) {
            count++;
            break;
          }
        }
      }
      return count;
    }
    return 0;
  });

  $effect(() => {
    resetStore();
    manipulatedData = [];
    hasManipulation = false;
  });

  function handleDataTransform(data: Table) {
    manipulatedData = data;
    hasManipulation = true;
    dataStore.update((s) => ({ ...s, transformedData: manipulatedData }));
  }

  function resetManipulation() {
    manipulatedData = [];
    hasManipulation = false;
    dataStore.update((s) => ({ ...s, transformedData: $dataStore.originalData }));
  }
</script>

<svelte:head>
  <title>Adatmanipuláció | Adateszköz Készlet</title>
</svelte:head>

<div class="d-flex flex-column min-vh-100">
  <Header />

  <main class="flex-grow-1">
    <div class="container py-4">
      <div class="mb-4 text-center">
        <h2 class="fw-bold mb-2">
          <i class="bi bi-gear-fill text-primary me-2"></i>
          Adatmanipuláció
        </h2>
        <p class="text-muted mb-0">
          Töltsön fel CSV/TSV fájlt, alkalmazzon átalakításokat, és exportálja az eredményt.
        </p>
      </div>

      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 col-xl-7">
          <FileUploader />
        </div>
      </div>

      {#if $dataStore.originalData.length > 0}
        <!-- Data Stats Card -->
        <div class="row justify-content-center mt-4">
          <div class="col-12 col-lg-8 col-xl-7">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <h6 class="card-title text-muted mb-3">
                  <i class="bi bi-bar-chart me-2"></i>Adatáttekintés
                </h6>
                <div class="row text-center">
                  <div class="col-4">
                    <div class="fw-bold text-primary fs-4">{originalRowCount}</div>
                    <small class="text-muted">Eredeti sorok</small>
                  </div>
                  <div class="col-4">
                    <div class="fw-bold text-success fs-4">{$dataStore.columns.length}</div>
                    <small class="text-muted">Oszlopok</small>
                  </div>
                  <div class="col-4">
                    <div class="fw-bold {hasManipulation ? 'text-info' : 'text-muted'} fs-4">
                      {hasManipulation ? manipulatedRowCount : originalRowCount}
                    </div>
                    <small class="text-muted">Jelenlegi sorok</small>
                  </div>
                </div>
                {#if hasManipulation}
                  <div class="mt-3 text-center">
                    {#if rowDifference !== 0}
                      <span class="badge {rowDifference > 0 ? 'bg-warning' : 'bg-info'} fs-6">
                        {rowDifference > 0 ? '-' : '+'}{Math.abs(rowDifference)} sor
                      </span>
                    {:else if modifiedRowCount > 0}
                      <span class="badge bg-primary fs-6">
                        {modifiedRowCount} módosított sor
                      </span>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Manipulation Controls -->
        <div class="row justify-content-center mt-4">
          <div class="col-12 col-lg-8 col-xl-7">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-light border-0">
                <h6 class="card-title mb-0">
                  <i class="bi bi-tools me-2"></i>Adatátalakítások
                </h6>
              </div>
              <div class="card-body">
                <DataManipulationSelector
                  data={hasManipulation ? manipulatedData : $dataStore.originalData}
                  onTransform={handleDataTransform}
                ></DataManipulationSelector>

                {#if hasManipulation}
                  <div class="mt-3 pt-3 border-top">
                    <button class="btn btn-outline-secondary btn-sm" onclick={resetManipulation}>
                      <i class="bi bi-arrow-counterclockwise me-1"></i>
                      Visszaállítás eredeti állapotra
                    </button>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Export Section -->
        {#if hasManipulation}
          <div class="row justify-content-center mt-4">
            <div class="col-12 col-lg-8 col-xl-7">
              <div class="card border-0 shadow-sm border-success">
                <div class="card-header bg-success bg-opacity-10 border-0">
                  <h6 class="card-title mb-0 text-success">
                    <i class="bi bi-check-circle me-2"></i>Exportálásra kész
                  </h6>
                </div>
                <div class="card-body">
                  <p class="text-muted mb-3">
                    Az adatok sikeresen át lettek alakítva. Exportálja az eredményt alább.
                  </p>
                  <FileExporter
                    data={manipulatedData}
                    filename="modositott_adatok.csv"
                    label="Módosított adatok exportálása"
                  />
                </div>
              </div>
            </div>
          </div>
        {:else if $dataStore.originalData.length > 0}
          <div class="row justify-content-center mt-4">
            <div class="col-12 col-lg-8 col-xl-7">
              <div class="card border-0 shadow-sm border-secondary">
                <div class="card-body text-center">
                  <i class="bi bi-info-circle text-muted fs-1 mb-3"></i>
                  <h6 class="text-muted">Még nincsenek átalakítások</h6>
                  <p class="text-muted small mb-3">
                    Válasszon átalakítást fent, vagy exportálja az eredeti adatokat.
                  </p>
                  <FileExporter
                    data={$dataStore.originalData}
                    filename="eredeti_adatok.csv"
                    label="Eredeti adatok exportálása"
                  />
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- Data Preview (Optional) -->
        {#if (hasManipulation ? manipulatedData : $dataStore.originalData).length > 0}
          <div class="row justify-content-center mt-4">
            <div class="col-12 col-lg-8 col-xl-7">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-light border-0">
                  <h6 class="card-title mb-0">
                    <i class="bi bi-table me-2"></i>Adatelőnézet
                    <span class="badge bg-secondary ms-2">
                      {hasManipulation ? 'Átalakított' : 'Eredeti'}
                    </span>
                  </h6>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table table-sm table-hover">
                      <thead class="table-light">
                        <tr>
                          {#each $dataStore.columns as column}
                            <th class="text-nowrap">{column}</th>
                          {/each}
                        </tr>
                      </thead>
                      <tbody>
                        {#each (hasManipulation ? manipulatedData : $dataStore.originalData).slice(0, 5) as row}
                          <tr>
                            {#each $dataStore.columns as column}
                              <td class="text-truncate" style="max-width: 150px;">
                                {row[column] || ''}
                              </td>
                            {/each}
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                    {#if (hasManipulation ? manipulatedData : $dataStore.originalData).length > 5}
                      <small class="text-muted">
                        Az első 5 sor megjelenítve {hasManipulation
                          ? manipulatedData.length
                          : $dataStore.originalData.length} összes sorból
                      </small>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </main>

  <Footer />
</div>

<style>
  :global(.manipulation-selector) {
    border: none !important;
    background-color: transparent !important;
    padding: 0 !important;
  }
</style>
