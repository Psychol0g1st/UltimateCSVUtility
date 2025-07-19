<script lang="ts">
  import type { Table } from '$lib/utils/CsvParser';
  import { DataTransformer } from '$lib/utils/DataTransformer';

  interface Props {
    data: Table;
    onTransform: (data: Table) => void;
  }

  let { data = $bindable([]), onTransform }: Props = $props();
  let column = $state('');
  let condition = $state('contains');
  let conditionValue = $state('');
  let replacementValue = $state('');

  let columns = $derived(data.length ? Object.keys(data[0]) : []);
  let isFormValid = $derived(
    column && replacementValue && (condition === 'isEmpty' || conditionValue)
  );

  const conditions = [
    { value: 'contains', label: 'Tartalmazza', needsValue: true },
    { value: 'equals', label: 'Megegyezik', needsValue: true },
    { value: 'isEmpty', label: 'Üres', needsValue: false },
    { value: 'startsWith', label: 'Kezdődik', needsValue: true },
    { value: 'endsWith', label: 'Végződik', needsValue: true }
  ];

  function apply() {
    const result = DataTransformer.replaceByCondition(
      data,
      column,
      condition,
      conditionValue,
      replacementValue
    );
    onTransform(result);
  }

  function resetForm() {
    column = '';
    condition = 'contains';
    conditionValue = '';
    replacementValue = '';
  }
</script>

<div class="card border-0">
  <div class="card-body p-0">
    <div class="row g-3">
      <!-- Column Selection -->
      <div class="col-12">
        <label class="form-label fw-semibold">
          <i class="bi bi-table me-1"></i>
          Válassz oszlopot
        </label>
        <select class="form-select" bind:value={column}>
          <option value="" disabled>Válassz oszlopot...</option>
          {#each columns as col}
            <option value={col}>{col}</option>
          {/each}
        </select>
      </div>

      <!-- Condition Selection -->
      <div class="col-md-6">
        <label class="form-label fw-semibold">
          <i class="bi bi-funnel me-1"></i>
          Feltétel
        </label>
        <select class="form-select" bind:value={condition}>
          {#each conditions as cond}
            <option value={cond.value}>{cond.label}</option>
          {/each}
        </select>
      </div>

      <!-- Condition Value (if needed) -->
      <div class="col-md-6">
        <label class="form-label fw-semibold">
          <i class="bi bi-search me-1"></i>
          {condition === 'contains'
            ? 'Tartalmazza a következőt'
            : condition === 'equals'
              ? 'Megegyezik ezzel'
              : condition === 'startsWith'
                ? 'Kezdődik ezzel'
                : condition === 'endsWith'
                  ? 'Végződik ezzel'
                  : 'Érték'}
        </label>
        <input
          type="text"
          class="form-control"
          bind:value={conditionValue}
          disabled={condition === 'isEmpty'}
          placeholder={condition === 'isEmpty' ? 'Nem szükséges' : 'Add meg az értéket...'}
        />
      </div>

      <!-- Replacement Value -->
      <div class="col-12">
        <label class="form-label fw-semibold">
          <i class="bi bi-arrow-right-circle me-1"></i>
          Csere erre
        </label>
        <input
          type="text"
          class="form-control"
          bind:value={replacementValue}
          placeholder="Add meg az új értéket..."
        />
      </div>

      <!-- Preview Section -->
      {#if column && condition}
        <div class="col-12">
          <div class="alert alert-info py-2 mb-0">
            <small class="fw-semibold">
              <i class="bi bi-info-circle me-1"></i>
              Előnézet:
            </small>
            <small>
              A(z) "<strong>{column}</strong>" oszlopban, ha az érték
              <strong>
                {condition === 'contains'
                  ? `tartalmazza a(z) "${conditionValue}"`
                  : condition === 'equals'
                    ? `megegyezik a(z) "${conditionValue}"`
                    : condition === 'isEmpty'
                      ? 'üres'
                      : condition === 'startsWith'
                        ? `a(z) "${conditionValue}"-ra/-re kezdődik`
                        : condition === 'endsWith'
                          ? `a(z) "${conditionValue}"-ra/-re végződik`
                          : ''}
              </strong>
              akkor cseréld erre: "<strong>{replacementValue}</strong>"
            </small>
          </div>
        </div>
      {/if}

      <!-- Action Buttons -->
      <div class="col-12">
        <div class="d-flex gap-2 justify-content-end">
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            onclick={resetForm}
            disabled={!column && !conditionValue && !replacementValue}
          >
            <i class="bi bi-arrow-counterclockwise me-1"></i>
            Visszaállítás
          </button>
          <button type="button" class="btn btn-primary" onclick={apply} disabled={!isFormValid}>
            <i class="bi bi-check-lg me-1"></i>
            Csere alkalmazása
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
