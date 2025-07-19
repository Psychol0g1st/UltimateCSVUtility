<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ColumnSelector from '$lib/components/ColumnSelector.svelte';
  import FileExporter from '$lib/components/FileExporter.svelte';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import { dataStore, resetStore } from '$lib/stores/dataStore';
  import { DataTransformer } from '$lib/utils/DataTransformer';
  import { onMount } from 'svelte';

  let selectedColumns: string[] = [];

  onMount(() => {
    resetStore();
    // Opcionális: console.log('Adattároló visszaállítva');
    // Opcionális: console.log('Kezdeti állapot:', $dataStore);
  });

  $: {
    $dataStore.transformedData = DataTransformer.filterColumns(
      $dataStore.originalData,
      selectedColumns
    );
  }
</script>

<svelte:head>
  <title>Oszlopválasztó | Adateszköz Készlet</title>
</svelte:head>

<div class="d-flex flex-column min-vh-100">
  <Header />

  <main class="flex-grow-1">
    <div class="container py-4">
      <div class="mb-4 text-center">
        <h2 class="fw-bold mb-2">
          <i class="bi bi-funnel text-primary me-2"></i>
          Oszlopválasztó
        </h2>
        <p class="text-muted mb-0">
          Töltsön fel CSV/TSV fájlt, válassza ki a megtartani kívánt oszlopokat, és exportálja az
          eredményt.
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
            <ColumnSelector bind:columns={$dataStore.columns} bind:selectedColumns />
          </div>
        </div>
        <div class="row justify-content-center mt-4">
          <div class="col-12 col-lg-8 col-xl-7">
            <FileExporter
              data={$dataStore.transformedData}
              filename="kivalasztott_oszlopok.csv"
              label="Kiválasztott oszlopok exportálása"
            />
          </div>
        </div>
      {/if}
    </div>
  </main>

  <Footer />
</div>
