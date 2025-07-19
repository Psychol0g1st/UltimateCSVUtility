<script lang="ts">
  import type { Delimiter } from '$lib/utils/CsvParser';

  export let delimiter: Delimiter = '\t';
</script>

<label>
  Delimiter:
  <select
    bind:value={delimiter}
    class="form-select form-select-sm"
    style="width:auto;display:inline-block;"
  >
    <option value=",">Vessző (,)</option>
    <option value={'\t'}>Tab (\t)</option>
    <option value=";">Pontosvessző (;)</option>
    <option value="|">Függőleges vonal (|)</option>
    <option value=" ">Szóköz ( )</option>
  </select>
</label>
