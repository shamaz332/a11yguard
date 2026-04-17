import { createSignal } from 'solid-js';
import {
  createFocusTrap,
  createAnnouncer,
  createReducedMotion,
  createColorScheme,
  createKeyboardNav,
} from '@shamaz332/a11yguard/solid';
import { injectSkipLink } from '@shamaz332/a11yguard';

injectSkipLink();

export default function App() {
  const announce = createAnnouncer();
  const reducedMotion = createReducedMotion();
  const colorScheme = createColorScheme();

  const [isOpen, setIsOpen] = createSignal(false);

  let modalRef: HTMLDivElement | undefined;
  let menuRef: HTMLDivElement | undefined;

  createFocusTrap(() => modalRef, { active: isOpen });
  createKeyboardNav(() => menuRef, { role: 'menu', items: '[role="menuitem"]' });

  function openModal() {
    setIsOpen(true);
    announce('Modal opened', 'polite');
  }

  function closeModal() {
    setIsOpen(false);
    announce('Modal closed', 'polite');
  }

  function confirm() {
    announce('Action confirmed!', 'assertive');
    closeModal();
  }

  return (
    <main id="main" style={{ 'font-family': 'system-ui, sans-serif', 'max-width': '800px', margin: '0 auto', padding: '24px' }}>
      <h1>@shamaz332/a11yguard — Solid Demo</h1>

      <div style={{ padding: '12px 16px', background: '#f0f4ff', 'border-radius': '6px', 'margin-bottom': '24px' }}>
        <strong>Preferences:</strong>{' '}
        Reduced motion: <code>{String(reducedMotion())}</code> |{' '}
        Color scheme: <code>{colorScheme()}</code>
      </div>

      <section>
        <h2>Focus Trap + Announcer</h2>
        <button
          id="open-modal"
          onClick={openModal}
          style={{ padding: '10px 20px', background: '#0066cc', color: '#fff', border: 'none', 'border-radius': '4px', cursor: 'pointer', 'font-weight': '600' }}
        >
          Open Modal
        </button>
      </section>

      {isOpen() && (
        <div style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.5)', display: 'flex', 'align-items': 'center', 'justify-content': 'center', 'z-index': '50' }}>
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            style={{ background: '#fff', 'border-radius': '8px', padding: '32px', 'max-width': '400px', width: '90%' }}
          >
            <h2 id="modal-title" style={{ 'margin-top': '0' }}>Accessible Modal</h2>
            <p>Focus is trapped with <code>createFocusTrap</code>. Escape closes this.</p>
            <div style={{ display: 'flex', gap: '8px', 'justify-content': 'flex-end', 'margin-top': '24px' }}>
              <button
                onClick={closeModal}
                style={{ padding: '10px 20px', background: '#595959', color: '#fff', border: 'none', 'border-radius': '4px', cursor: 'pointer', 'font-weight': '600' }}
              >
                Cancel
              </button>
              <button
                onClick={confirm}
                style={{ padding: '10px 20px', background: '#0066cc', color: '#fff', border: 'none', 'border-radius': '4px', cursor: 'pointer', 'font-weight': '600' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <section style={{ 'margin-top': '32px' }}>
        <h2>Keyboard Navigation</h2>
        <div
          ref={menuRef}
          role="menu"
          aria-label="Demo menu"
          style={{ border: '1px solid #ccc', 'border-radius': '4px', 'max-width': '200px' }}
        >
          {(['Item 1', 'Item 2', 'Item 3'] as const).map((item, i) => (
            <div
              role="menuitem"
              tabindex={i === 0 ? 0 : -1}
              style={{ padding: '8px 12px', cursor: 'pointer' }}
              onClick={() => announce(`Selected: ${item}`)}
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
