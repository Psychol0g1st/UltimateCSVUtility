<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ColumnRenamer from '$lib/components/ColumnRenamer.svelte';
  import FileExporter from '$lib/components/FileExporter.svelte';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import { dataStore, resetStore } from '$lib/stores/dataStore';
  import { DataTransformer } from '$lib/utils/DataTransformer';
  import { onMount } from 'svelte';

  let renamedColumns: string[] = [];

  onMount(() => {
    resetStore();
    // Opcionális: console.log('Adattároló visszaállítva');
    // Opcionális: console.log('Kezdeti állapot:', $dataStore);
  });

  // Transzformált adatok frissítése
  $: {
    if (renamedColumns.length === $dataStore.columns.length) {
      $dataStore.transformedData = DataTransformer.renameColumns(
        $dataStore.originalData,
        $dataStore.columns,
        renamedColumns
      );
    }
  }
</script>

<svelte:head>
  <title>Oszlopátnevező | Adateszköz Készlet</title>
</svelte:head>

<div class="d-flex flex-column min-vh-100">
  <Header />

  <main class="flex-grow-1">
    <div class="container py-4">
      <div class="mb-4 text-center">
        <h2 class="fw-bold mb-2">
          <i class="bi bi-pencil-square text-primary me-2"></i>
          Oszlopátnevező
        </h2>
        <p class="text-muted mb-0">
          Töltsön fel CSV/TSV fájlt, nevezze át az oszlopokat, és exportálja az eredményt.
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
            <ColumnRenamer bind:columns={$dataStore.columns} bind:renamedColumns />
          </div>
        </div>
        <div class="row justify-content-center mt-4">
          <div class="col-12 col-lg-8 col-xl-7">
            <FileExporter
              data={$dataStore.transformedData}
              filename="atnevezett_oszlopok.csv"
              label="Átnevezett oszlopok exportálása"
            />
          </div>
        </div>
      {/if}
    </div>
  </main>

  <Footer />
</div>
