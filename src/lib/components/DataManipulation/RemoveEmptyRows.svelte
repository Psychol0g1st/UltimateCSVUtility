<script lang="ts">
  import type { Table } from '$lib/utils/CsvParser';
  import { DataTransformer } from '$lib/utils/DataTransformer';

  interface Props {
    data: Table;
    onTransform: (data: Table) => void;
  }

  let { data = $bindable([]), onTransform }: Props = $props();
  let column = $state('');
  let columns = $derived(data.length ? Object.keys(data[0]) : []);

  function apply() {
    const result = DataTransformer.removeEmptyRows(data, column);
    onTransform(result);
  }
</script>

<div>
  <label>
    Column:
    <select bind:value={column}>
      <option value="" disabled selected>Válassz oszlopot</option>
      {#each columns as col}
        <option value={col}>{col}</option>
      {/each}
    </select>
  </label>
  <button onclick={apply} disabled={!column}>Alkalmazás</button>
</div>
