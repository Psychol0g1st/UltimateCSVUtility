<script lang="ts">
  import { dataStore } from '$lib/stores/dataStore';
  $: data = $dataStore.transformedData;
</script>

{#if data.length > 0}
  <div class="table-responsive" style="max-height: 60vh; overflow-y: auto;">
    <table class="table table-bordered table-hover table-sm align-middle mb-0">
      <thead class="table-light sticky-top">
        <tr>
          {#each Object.keys(data[0]) as col}
            <th scope="col" class="text-nowrap">{col}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each data as row}
          <tr>
            {#each Object.values(row) as val}
              <td class="text-nowrap">{val}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <div class="alert alert-info my-3" role="alert">Nincs megjeleníthető adat.</div>
{/if}
