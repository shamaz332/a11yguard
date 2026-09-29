import { describe, it, expect } from 'vitest';
import { describeField } from '../../src/core/field.js';
import { createId, ensureId } from '../../src/core/id.js';

function buildField(): {
  input: HTMLInputElement;
  label: HTMLLabelElement;
  hint: HTMLElement;
  error: HTMLElement;
} {
  document.body.innerHTML = `
    <label>Email</label>
    <input type="email" />
    <p class="hint">We never share it.</p>
    <p class="error"></p>
  `;
  return {
    input: document.querySelector('input') as HTMLInputElement,
    label: document.querySelector('label') as HTMLLabelElement,
    hint: document.querySelector('.hint') as HTMLElement,
    error: document.querySelector('.error') as HTMLElement,
  };
}

describe('createId / ensureId', () => {
  it('generates unique prefixed ids', () => {
    const a = createId('tip');
    const b = createId('tip');
    expect(a).toMatch(/^tip-\d+$/);
    expect(a).not.toBe(b);
  });

  it('keeps an existing id', () => {
    const el = document.createElement('div');
    el.id = 'mine';
    expect(ensureId(el)).toBe('mine');
  });

  it('assigns an id when missing', () => {
    const el = document.createElement('div');
    const id = ensureId(el, 'x');
    expect(el.id).toBe(id);
    expect(id).toMatch(/^x-\d+$/);
  });
});

describe('describeField', () => {
  it('links a <label> with for', () => {
    const { input, label } = buildField();
    describeField(input, { label });
    expect(input.id).toBeTruthy();
    expect(label.htmlFor).toBe(input.id);
  });

  it('links a non-label element with aria-labelledby', () => {
    const { input } = buildField();
    const heading = document.createElement('span');
    document.body.appendChild(heading);
    describeField(input, { label: heading });
    expect(input.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('adds the hint to aria-describedby, keeping existing tokens', () => {
    const { input, hint } = buildField();
    input.setAttribute('aria-describedby', 'other');
    describeField(input, { hint });
    expect(input.getAttribute('aria-describedby')).toBe(`other ${hint.id}`);
  });

  it('hides the error element until an error is set', () => {
    const { input, error } = buildField();
    describeField(input, { error });
    expect(error.hidden).toBe(true);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('setError marks the field invalid and links the message', () => {
    const { input, hint, error } = buildField();
    const field = describeField(input, { hint, error });
    field.setError('Enter a valid email');
    expect(error.textContent).toBe('Enter a valid email');
    expect(error.hidden).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-errormessage')).toBe(error.id);
    expect(input.getAttribute('aria-describedby')).toBe(`${hint.id} ${error.id}`);
  });

  it('setError(null) clears the error state', () => {
    const { input, hint, error } = buildField();
    const field = describeField(input, { hint, error });
    field.setError('Oops');
    field.setError(null);
    expect(error.hidden).toBe(true);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.hasAttribute('aria-errormessage')).toBe(false);
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('announces new errors', async () => {
    const { input, error } = buildField();
    describeField(input, { error }).setError('Required');
    await new Promise((r) => requestAnimationFrame(r));
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe('Required');
  });

  it('does not announce when announce is false', () => {
    const { input, error } = buildField();
    describeField(input, { error, announce: false }).setError('Required');
    expect(document.querySelector('[aria-live]')).toBeNull();
  });

  it('marks invalid without an error element', () => {
    const { input } = buildField();
    describeField(input, { announce: false }).setError('Bad');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('destroy restores original attributes', () => {
    const { input, label, hint, error } = buildField();
    input.setAttribute('aria-describedby', 'other');
    const field = describeField(input, { label, hint, error });
    field.setError('Oops');
    field.destroy();
    expect(input.getAttribute('aria-describedby')).toBe('other');
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.hasAttribute('aria-errormessage')).toBe(false);
    expect(label.hasAttribute('for')).toBe(false);
    expect(error.hidden).toBe(false);
  });
});
