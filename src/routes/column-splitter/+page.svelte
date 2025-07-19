<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import FileExporter from '$lib/components/FileExporter.svelte';
  import ColumnSplitter from '$lib/components/ColumnSplitter.svelte';
  import { dataStore, resetStore } from '$lib/stores/dataStore';
  import { onMount } from 'svelte';

  let splitResultData = [];
  let splitResultColumns = [];

  onMount(() => {
    resetStore();
  });

  function handleSplit({ data, newColumns }) {
    splitResultData = data;
    splitResultColumns = newColumns;
    // Opcionálisan frissíthetjük a $dataStore.transformedData-t, ha a FileExporter-t használnánk
    $dataStore.transformedData = data;
    $dataStore.columns = Object.keys(data[0] ?? {});
  }
</script>

<svelte:head>
  <title>Oszlopfelosztó | Adateszköz Készlet</title>
</svelte:head>

<div class="d-flex flex-column min-vh-100">
  <Header />

  <main class="flex-grow-1">
    <div class="container py-4">
      <div class="mb-4 text-center">
        <h2 class="fw-bold mb-2">
          <i class="bi bi-scissors text-primary me-2"></i>
          Oszlopfelosztó
        </h2>
        <p class="text-muted mb-0">
          Töltsön fel CSV/TSV fájlt, osszon fel egy oszlopot elválasztójel alapján, és exportálja az
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
            <ColumnSplitter
              columns={$dataStore.columns}
              data={$dataStore.originalData}
              onSplit={handleSplit}
            />
          </div>
        </div>
        {#if splitResultData.length > 0}
          <div class="row justify-content-center mt-4">
            <div class="col-12 col-lg-8 col-xl-7">
              <FileExporter
                data={splitResultData}
                filename="felosztott_oszlopok.csv"
                label="Felosztott oszlopok exportálása"
              />
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </main>

  <Footer />
</div>
