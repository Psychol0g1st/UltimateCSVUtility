<script lang="ts">
  import type { Table } from '$lib/utils/CsvParser';
  import RemoveEmptyRows from './RemoveEmptyRows.svelte';
  import ReplaceByCondition from './ReplaceByCondition.svelte';

  interface Props {
    data: Table;
    onTransform: (data: Table) => void;
  }

  let { data = $bindable([]), onTransform }: Props = $props();
  let manipulation = $state('removeEmptyRows');

  function handleTransform(transformedData: Table) {
    onTransform(transformedData);
  }

  const manipulations = [
    { value: 'removeEmptyRows', label: 'Üres sorok eltávolítása' },
    { value: 'replaceByCondition', label: 'Feltételes szöveg csere' }
    // { value: 'removeRowsByValue', label: 'Remove rows by value' },
    // { value: 'replaceInColumn', label: 'Replace in column' },
    // { value: 'addPrefixToColumn', label: 'Add prefix to column' },
    // { value: 'addSuffixToColumn', label: 'Add suffix to column' },
    // { value: 'removeSubstringFromColumn', label: 'Remove substring from column' }
  ];
</script>

<div class="manipulation-selector">
  <div class="selector-header">
    <label>
      <span>Válassz műveletet:</span>
      <select bind:value={manipulation}>
        {#each manipulations as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="manipulation-form">
    {#if manipulation === 'removeEmptyRows'}
      <RemoveEmptyRows {data} onTransform={handleTransform} />
    {:else if manipulation === 'replaceByCondition'}
      <ReplaceByCondition {data} onTransform={handleTransform} />
    {/if}
  </div>
</div>

<style>
  .manipulation-selector {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 500px;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fafafa;
  }

  .selector-header {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 1rem;
  }

  .selector-header label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .selector-header span {
    font-weight: 600;
    color: #333;
  }

  .selector-header select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .manipulation-form {
    background-color: white;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
  }

  :global(.manipulation-form label) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  :global(.manipulation-form select),
  :global(.manipulation-form input) {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  :global(.manipulation-form button) {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
  }

  :global(.manipulation-form button:hover) {
    background-color: #0056b3;
  }

  :global(.manipulation-form button:disabled) {
    background-color: #6c757d;
    cursor: not-allowed;
  }
</style>
