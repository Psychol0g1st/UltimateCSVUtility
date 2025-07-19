<script lang="ts">
  import { dataStore } from '$lib/stores/dataStore';
  import { CsvParser, type Delimiter } from '$lib/utils/CsvParser';
  import DelimeterSelect from './DelimeterSelect.svelte';

  export let delimiter: Delimiter = '\t';
  export let label: string = 'CSV/TSV feltöltése';

  let isUploading = false;
  let uploadedFileName = '';

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    isUploading = true;
    uploadedFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const data = CsvParser.parse(text, delimiter);
        dataStore.update((state) => ({
          ...state,
          originalData: data,
          transformedData: data,
          columns: Object.keys(data[0] ?? {}),
          delimiter,
          filename: file.name
        }));
      } catch (error) {
        console.error('Error parsing file:', error);
        // You might want to show an error message to the user
      } finally {
        isUploading = false;
      }
    };
    reader.readAsText(file, 'utf-8');
  }
</script>

<div class="card shadow-sm mb-4">
  <div class="card-body">
    <div class="d-flex align-items-center mb-3">
      <i class="bi bi-cloud-upload-fill text-primary me-2 fs-4"></i>
      <h5 class="card-title mb-0">{label}</h5>
    </div>

    <!-- Delimiter Selection -->
    <div class="mb-3">
      <label class="form-label fw-semibold">Elválasztójel</label>
      <DelimeterSelect bind:delimiter />
    </div>

    <!-- File Input -->
    <div class="mb-3">
      <label class="form-label fw-semibold" for="fileInput">Fájl kiválasztása</label>
      <input
        type="file"
        id="fileInput"
        accept=".csv,.tsv,text/csv,text/tab-separated-values"
        class="form-control {isUploading ? 'is-valid' : ''}"
        on:change={handleFileChange}
        disabled={isUploading}
        aria-describedby="fileHelp"
      />
      <div id="fileHelp" class="form-text">
        <i class="bi bi-info-circle me-1"></i>
        Támogatott formátumok: CSV, TSV fájlok
      </div>
    </div>

    <!-- Upload Status -->
    {#if isUploading}
      <div class="alert alert-info d-flex align-items-center" role="status">
        <div class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        <span><strong>{uploadedFileName}</strong> feldolgozása...</span>
      </div>
    {/if}

    {#if uploadedFileName && !isUploading}
      <div class="alert alert-success d-flex align-items-center" role="status">
        <i class="bi bi-check-circle-fill me-2"></i>
        <span><strong>{uploadedFileName}</strong> sikeresen betöltve</span>
      </div>
    {/if}
  </div>
</div>
