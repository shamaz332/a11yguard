<script lang="ts">
  import { focusTrap, keyboardNav, announcer, reducedMotion, colorScheme } from '@shamaz332/a11yguard/svelte';
  import { injectSkipLink } from '@shamaz332/a11yguard';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  onMount(() => injectSkipLink());

  const isOpen = writable(false);

  function openModal() {
    isOpen.set(true);
    announcer.announce('Modal opened', 'polite');
  }

  function closeModal() {
    isOpen.set(false);
    announcer.announce('Modal closed', 'polite');
  }

  function confirm() {
    announcer.announce('Action confirmed!', 'assertive');
    closeModal();
  }
</script>

<main id="main" style="font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 24px">
  <h1>@shamaz332/a11yguard — Svelte Demo</h1>

  <div style="padding: 12px 16px; background: #f0f4ff; border-radius: 6px; margin-bottom: 24px">
    <strong>Preferences:</strong>
    Reduced motion: <code>{$reducedMotion}</code> |
    Color scheme: <code>{$colorScheme}</code>
  </div>

  <section>
    <h2>Focus Trap + Announcer</h2>
    <button id="open-modal" on:click={openModal}
      style="padding: 10px 20px; background: #0066cc; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 600">
      Open Modal
    </button>
  </section>

  {#if $isOpen}
    <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50">
      <div
        use:focusTrap={{ active: $isOpen }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style="background: #fff; border-radius: 8px; padding: 32px; max-width: 400px; width: 90%"
      >
        <h2 id="modal-title" style="margin-top: 0">Accessible Modal</h2>
        <p>Focus is trapped with <code>use:focusTrap</code>. Escape closes this.</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 24px">
          <button on:click={closeModal}
            style="padding: 10px 20px; background: #595959; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 600">
            Cancel
          </button>
          <button on:click={confirm}
            style="padding: 10px 20px; background: #0066cc; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 600">
            Confirm
          </button>
        </div>
      </div>
    </div>
  {/if}

  <section style="margin-top: 32px">
    <h2>Keyboard Navigation</h2>
    <div
      use:keyboardNav={{ role: 'menu', items: '[role="menuitem"]' }}
      role="menu"
      aria-label="Demo menu"
      style="border: 1px solid #ccc; border-radius: 4px; max-width: 200px"
    >
      {#each ['Item 1', 'Item 2', 'Item 3'] as item, i}
        <div role="menuitem" tabindex={i === 0 ? 0 : -1}
          style="padding: 8px 12px; cursor: pointer"
          on:click={() => announcer.announce(`Selected: ${item}`)}>
          {item}
        </div>
      {/each}
    </div>
  </section>
</main>
