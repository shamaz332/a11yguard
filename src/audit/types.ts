export type WCAGLevel = 'A' | 'AA' | 'AAA';
export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';

export interface Violation {
  ruleId: string;
  wcag: string[];
  eaa: string[];
  severity: Severity;
  element: Element;
  selector: string;
  message: string;
  help: string;
}

export interface AuditRule {
  id: string;
  wcag: string[];
  severity: Severity;
  check(root: Element | Document, level: WCAGLevel): Violation[];
}

export interface AuditOptions {
  root?: Element | Document;
  level?: WCAGLevel;
  rules?: string[];
  exclude?: string[];
}

export interface AuditResult {
  violations: Violation[];
  passes: number;
  timestamp: number;
  url: string;
  level: WCAGLevel;
}
