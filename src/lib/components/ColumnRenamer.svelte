<script lang="ts">
  export let columns: string[] = [];
  export let renamedColumns: string[] = [];

  import { onMount } from 'svelte';
  onMount(() => {
    if (renamedColumns.length !== columns.length) {
      renamedColumns = [...columns];
    }
  });

  function handleRename(index: number, value: string) {
    renamedColumns = renamedColumns.map((col, i) => (i === index ? value : col));
  }
</script>

<div class="card shadow-sm mb-3">
  <div class="card-body">
    <h5 class="card-title mb-3">Oszlopok átnevezése</h5>
    <form autocomplete="off">
      {#each columns as col, i}
        <div class="row align-items-center mb-3 g-2">
          <div class="col-12 col-md-5">
            <label class="form-label mb-0 fw-semibold text-secondary" for={'col-rename-' + i}>
              {col}
            </label>
          </div>
          <div class="col-12 col-md-7">
            <input
              id={'col-rename-' + i}
              type="text"
              class="form-control"
              bind:value={renamedColumns[i]}
              on:input={(e) => handleRename(i, (e.target as HTMLInputElement).value)}
              placeholder="Új oszlopnév"
              aria-label={'Átnevezendő oszlop: ' + col}
            />
          </div>
        </div>
      {/each}
    </form>
  </div>
</div>
