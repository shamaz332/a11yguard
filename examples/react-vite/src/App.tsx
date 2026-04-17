import React, { useState, useEffect } from 'react';
import {
  useFocusTrap,
  useAnnouncer,
  useReducedMotion,
  useColorScheme,
  useScrollLock,
} from '@shamaz332/a11yguard/react';
import { injectSkipLink, checkContrast } from '@shamaz332/a11yguard';

// Inject skip link once
injectSkipLink();

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({
  open,
  onClose,
  title,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
}) {
  const ref = useFocusTrap({ active: open, onDeactivate: onClose });
  const announce = useAnnouncer();
  useScrollLock(open);

  useEffect(() => {
    if (open) announce(`${title} opened`, 'polite');
  }, [open, title]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          background: '#fff', borderRadius: 8,
          padding: 32, maxWidth: 400, width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <h2 id="modal-title" style={{ marginTop: 0 }}>{title}</h2>
        <p>
          This modal uses <strong>useFocusTrap</strong> — keyboard focus is
          trapped inside, the Escape key closes it, and focus returns to the
          trigger button on close.
        </p>
        <p>
          Background content is <strong>inert</strong> while this is open —
          screen readers cannot navigate outside the modal.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={onClose} style={btnStyle('#595959')}>
            Cancel
          </button>
          <button
            onClick={() => { announce('Action confirmed!', 'assertive'); onClose(); }}
            style={btnStyle('#0066cc')}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    padding: '10px 20px',
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
  };
}

// ─── Contrast Checker ─────────────────────────────────────────────────────────

function ContrastChecker() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const result = checkContrast(fg, bg, { algorithm: 'both', fontSize: 16 });

  return (
    <section style={{ marginTop: 32 }}>
      <h2>Contrast Checker</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label>
          Foreground
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)}
            style={{ display: 'block', marginTop: 4, width: 80, height: 40 }} />
        </label>
        <label>
          Background
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
            style={{ display: 'block', marginTop: 4, width: 80, height: 40 }} />
        </label>
        <div
          style={{
            padding: '16px 24px',
            background: bg,
            color: fg,
            borderRadius: 4,
            border: '1px solid #ccc',
            fontWeight: 600,
          }}
        >
          Sample Text
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <ResultBadge
          label={`WCAG ratio: ${result.wcag?.ratio ?? '—'}`}
          pass={result.wcag?.passes ?? false}
          detail={`Level: ${result.wcag?.level ?? '—'}`}
        />
        <ResultBadge
          label={`APCA Lc: ${result.apca?.lc ?? '—'}`}
          pass={result.apca?.passes ?? false}
          detail={`Min required: ${result.apca?.minRequired ?? '—'}`}
        />
      </div>
    </section>
  );
}

function ResultBadge({ label, pass, detail }: { label: string; pass: boolean; detail: string }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: 6,
      background: pass ? '#d4edda' : '#f8d7da',
      border: `1px solid ${pass ? '#28a745' : '#dc3545'}`,
      color: pass ? '#155724' : '#721c24',
    }}>
      <strong>{label}</strong>
      <br />
      <small>{detail} — {pass ? '✓ Pass' : '✗ Fail'}</small>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const reduced = useReducedMotion();
  const scheme = useColorScheme();

  return (
    <div id="main" style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>@shamaz332/a11yguard — React Demo</h1>

      <div style={{ padding: '12px 16px', background: '#f0f4ff', borderRadius: 6, marginBottom: 24 }}>
        <strong>Preferences:</strong>{' '}
        Reduced motion: <code>{String(reduced)}</code>{' | '}
        Color scheme: <code>{scheme}</code>
      </div>

      <section>
        <h2>Focus Trap + Scroll Lock + Announcer</h2>
        <p>Open the modal to see all three in action.</p>
        <button
          onClick={() => setModalOpen(true)}
          style={btnStyle('#0066cc')}
          id="open-modal"
        >
          Open Modal
        </button>
      </section>

      <ContrastChecker />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Accessible Modal"
      />
    </div>
  );
}
