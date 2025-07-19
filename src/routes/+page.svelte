<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { base } from '$app/paths';
  interface Utility {
    name: string;
    path: string;
    description: string;
  }

  const utilities: Utility[] = [
    {
      name: 'Oszlopválasztó',
      path: '/column-selector',
      description:
        'CSV/TSV fájlok feltöltése, majd oszlopok kiválasztása és exportálás csak a kiválasztott oszlopokkal.'
    },
    {
      name: 'Oszlopátnevező',
      path: '/column-renamer',
      description:
        'CSV/TSV fájlok feltöltése, oszlopok átnevezése és exportálás az új oszlopnevekkel.'
    },
    {
      name: 'Cikkszám normalizáló',
      path: '/sku-normalizer',
      description:
        'CSV/TSV fájlok feltöltése, SKU oszlopok normalizálása egységes formátumra és az eredmény exportálása.'
    },
    {
      name: 'Adatmanipuláció',
      path: '/data-manipulation',
      description:
        'Eszközkészlet táblázatos adatok kezelésére, üres sorok törlésére, oszlopok szűrésére és egyéb műveletekre.'
    },
    {
      name: 'Oszlop szétbontása',
      path: '/column-splitter',
      description:
        'CSV/TSV fájlok feltöltése, oszlop felosztása megadott elválasztó karakter alapján több oszlopba és az eredmény exportálása.'
    }
  ];
</script>

<svelte:head>
  <title>Adateszköz Készlet</title>
</svelte:head>

<Header />

<main class="container py-5 flex-grow-1">
  <div class="text-center mb-5">
    <h1 class="display-5 fw-bold mb-3">
      <i class="bi bi-table me-2 text-primary"></i>
      Adateszköz Készlet
    </h1>
    <p class="lead text-muted">
      Böngészőalapú eszközök táblázatos és szöveges adatok kezelésére.<br />
      Válasszon eszközt a kezdéshez.
    </p>
  </div>
  <div class="row justify-content-center">
    {#each utilities as util}
      <div class="col-12 col-md-6 col-lg-4 mb-4 d-flex">
        <div class="card h-100 shadow-sm flex-fill">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{util.name}</h5>
            <p class="card-text flex-grow-1">{util.description}</p>
            <a class="btn btn-primary mt-2" href={`${base}${util.path}`}>
              <i class="bi bi-box-arrow-up-right me-1"></i>
              Megnyitás
            </a>
          </div>
        </div>
      </div>
    {/each}
  </div>
</main>

<Footer />
