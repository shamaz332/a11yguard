import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';

const WCAG = ['1.3.1'];

export const tableHeaders: AuditRule = {
  id: 'table-headers',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];
    for (const table of queryAll(root, 'table')) {
      const role = table.getAttribute('role');
      if (role === 'presentation' || role === 'none') continue;

      const rows = Array.from(table.querySelectorAll('tr'));
      const isDataTable = rows.length > 1 && rows.some((r) => r.cells.length > 1);
      if (!isDataTable) continue;

      if (table.querySelector('th, [role="columnheader"], [role="rowheader"]')) continue;

      violations.push(
        makeViolation(
          'table-headers',
          WCAG,
          'serious',
          table,
          'Data table has no header cells',
          'Mark header cells with <th> (and scope="col"/"row"), or add role="presentation" if the table is only used for layout.'
        )
      );
    }
    return violations;
  },
};
