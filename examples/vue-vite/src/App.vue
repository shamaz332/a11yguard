<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  useFocusTrap,
  useAnnouncer,
  useReducedMotion,
  useColorScheme,
  useScrollLock,
} from '@shamaz332/a11yguard/vue';
import { injectSkipLink, checkContrast } from '@shamaz332/a11yguard';

injectSkipLink();

// ─── Modal ────────────────────────────────────────────────────────────────────

const modalOpen = ref(false);
const announce = useAnnouncer();
const reduced = useReducedMotion();
const scheme = useColorScheme();

const modalRef = useFocusTrap({ active: modalOpen });
useScrollLock(modalOpen);

watch(modalOpen, (open) => {
  if (open) announce('Accessible Modal opened', 'polite');
});

function confirm() {
  announce('Action confirmed!', 'assertive');
  modalOpen.value = false;
}

// ─── Contrast checker ─────────────────────────────────────────────────────────

const fg = ref('#000000');
const bg = ref('#ffffff');

function getResult() {
  try {
    return checkContrast(fg.value, bg.value, { algorithm: 'both', fontSize: 16 });
  } catch {
    return null;
  }
}
</script>

<template>
  <div id="main" style="font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 24px">
    <h1>@shamaz332/a11yguard — Vue Demo</h1>

    <div style="padding: 12px 16px; background: #f0f4ff; border-radius: 6px; margin-bottom: 24px">
      <strong>Preferences:</strong>
      Reduced motion: <code>{{ reduced }}</code> |
      Color scheme: <code>{{ scheme }}</code>
    </div>

    <section>
      <h2>Focus Trap + Scroll Lock + Announcer</h2>
      <p>Open the modal to see all three in action.</p>
      <button id="open-modal" @click="modalOpen = true" style="padding: 10px 20px; background: #0066cc; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 600">
        Open Modal
      </button>
    </section>

    <!-- Modal -->
    <Teleport to="body">
      <div
        v-if="modalOpen"
        style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50"
      >
        <div
          :ref="modalRef"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style="background: #fff; border-radius: 8px; padding: 32px; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3)"
        >
          <h2 id="modal-title" style="margin-top: 0">Accessible Modal</h2>
          <p>
            This modal uses <strong>useFocusTrap</strong> — keyboard focus is
            trapped inside, Escape closes it, and focus returns to the trigger
            on close.
          </p>
          <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 24px">
            <button @click="modalOpen = false" style="padding: 10px 20px; background: #595959; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 600">
              Cancel
            </button>
            <button @click="confirm" style="padding: 10px 20px; background: #0066cc; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 600">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Contrast Checker -->
    <section style="margin-top: 32px">
      <h2>Contrast Checker</h2>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-end">
        <label>
          Foreground
          <input type="color" v-model="fg" style="display: block; margin-top: 4px; width: 80px; height: 40px" />
        </label>
        <label>
          Background
          <input type="color" v-model="bg" style="display: block; margin-top: 4px; width: 80px; height: 40px" />
        </label>
        <div :style="{ padding: '16px 24px', background: bg, color: fg, borderRadius: '4px', border: '1px solid #ccc', fontWeight: 600 }">
          Sample Text
        </div>
      </div>

      <template v-if="getResult() as any">
        <div style="margin-top: 16px; display: flex; gap: 16px; flex-wrap: wrap">
          <div
            :style="{
              padding: '12px 16px', borderRadius: '6px',
              background: getResult()?.wcag?.passes ? '#d4edda' : '#f8d7da',
              border: `1px solid ${getResult()?.wcag?.passes ? '#28a745' : '#dc3545'}`,
              color: getResult()?.wcag?.passes ? '#155724' : '#721c24',
            }"
          >
            <strong>WCAG ratio: {{ getResult()?.wcag?.ratio }}</strong><br />
            <small>Level: {{ getResult()?.wcag?.level }} — {{ getResult()?.wcag?.passes ? '✓ Pass' : '✗ Fail' }}</small>
          </div>
          <div
            :style="{
              padding: '12px 16px', borderRadius: '6px',
              background: getResult()?.apca?.passes ? '#d4edda' : '#f8d7da',
              border: `1px solid ${getResult()?.apca?.passes ? '#28a745' : '#dc3545'}`,
              color: getResult()?.apca?.passes ? '#155724' : '#721c24',
            }"
          >
            <strong>APCA Lc: {{ getResult()?.apca?.lc }}</strong><br />
            <small>Min required: {{ getResult()?.apca?.minRequired }} — {{ getResult()?.apca?.passes ? '✓ Pass' : '✗ Fail' }}</small>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>
