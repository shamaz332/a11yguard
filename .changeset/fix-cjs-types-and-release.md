---
'@shamaz332/a11yguard': patch
---

Fix CommonJS type resolution: `require` conditions in `exports` now point at the generated `.d.cts` declaration files, so TypeScript projects using `moduleResolution: node16`/`nodenext` from CJS get correct types (previously "masquerading as ESM"). Also exposes `./package.json` and publishes with npm provenance.
