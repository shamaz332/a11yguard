import React, { useState } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouteAnnouncer } from '../../src/react/use-route-announcer.js';
import { useSkipLink } from '../../src/react/use-skip-link.js';
import { useFocusRestore } from '../../src/react/use-focus-restore.js';
import { useA11yId } from '../../src/react/use-a11y-id.js';
import { VisuallyHidden } from '../../src/react/visually-hidden.js';

describe('useRouteAnnouncer', () => {
  function Page({ path }: { path: string }): React.ReactElement {
    useRouteAnnouncer(path);
    return (
      <main>
        <h1>{path}</h1>
        <button>other</button>
      </main>
    );
  }

  it('does nothing on first render', () => {
    render(<Page path="/a" />);
    expect(document.activeElement).toBe(document.body);
  });

  it('focuses the heading when the route key changes', () => {
    const { rerender } = render(<Page path="/a" />);
    rerender(<Page path="/b" />);
    expect(document.activeElement?.tagName).toBe('H1');
    expect(document.activeElement?.textContent).toBe('/b');
  });

  it('does not re-run when the key is unchanged', () => {
    const { rerender } = render(<Page path="/a" />);
    rerender(<Page path="/b" />);
    screen.getByText('other').focus();
    rerender(<Page path="/b" />);
    expect(document.activeElement?.textContent).toBe('other');
  });
});

describe('useSkipLink', () => {
  function Layout({ label }: { label?: string }): React.ReactElement {
    useSkipLink({ target: '#main', ...(label ? { label } : {}) });
    return <main id="main" />;
  }

  it('injects a skip link and removes it on unmount', () => {
    const { unmount } = render(<Layout />);
    const link = document.querySelector('[data-a11yguard-skip-link]');
    expect(link?.getAttribute('href')).toBe('#main');
    unmount();
    expect(document.querySelector('[data-a11yguard-skip-link]')).toBeNull();
  });

  it('uses a custom label', () => {
    render(<Layout label="Jump to content" />);
    expect(document.querySelector('[data-a11yguard-skip-link]')?.textContent).toBe(
      'Jump to content'
    );
  });
});

describe('useFocusRestore', () => {
  function Menu(): React.ReactElement {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>trigger</button>
        {open && <MenuPanel onClose={() => setOpen(false)} />}
      </>
    );
  }
  function MenuPanel({ onClose }: { onClose: () => void }): React.ReactElement {
    useFocusRestore(true);
    return (
      <button autoFocus onClick={onClose}>
        close
      </button>
    );
  }

  it('returns focus to the trigger when the panel closes', () => {
    render(<Menu />);
    const trigger = screen.getByText('trigger');
    trigger.focus();
    fireEvent.click(trigger);
    screen.getByText('close').focus();
    fireEvent.click(screen.getByText('close'));
    expect(document.activeElement).toBe(trigger);
  });
});

describe('useA11yId', () => {
  function Ids(): React.ReactElement {
    const a = useA11yId('hint');
    const b = useA11yId('hint');
    return <div data-a={a} data-b={b} data-testid="ids" />;
  }

  it('returns distinct, prefixed, colon-free ids that are stable across renders', () => {
    const { rerender } = render(<Ids />);
    const el = screen.getByTestId('ids');
    const a = el.getAttribute('data-a');
    const b = el.getAttribute('data-b');
    expect(a).toMatch(/^hint-/);
    expect(a).not.toContain(':');
    expect(a).not.toBe(b);
    rerender(<Ids />);
    expect(screen.getByTestId('ids').getAttribute('data-a')).toBe(a);
  });
});

describe('VisuallyHidden', () => {
  it('renders a visually hidden span by default', () => {
    render(<VisuallyHidden>Delete</VisuallyHidden>);
    const el = screen.getByText('Delete');
    expect(el.tagName).toBe('SPAN');
    expect(el.style.position).toBe('absolute');
    expect(el.style.width).toBe('1px');
  });

  it('supports as and extra props', () => {
    render(
      <VisuallyHidden as="h2" id="x" style={{ color: 'red' }}>
        Title
      </VisuallyHidden>
    );
    const el = screen.getByText('Title');
    expect(el.tagName).toBe('H2');
    expect(el.id).toBe('x');
    expect(el.style.color).toBe('red');
    expect(el.style.clip).toContain('rect(0');
  });
});
