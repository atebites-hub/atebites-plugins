# factory-policy releases

## 0.1.1

- Read-only native tools no longer enter the source-edit gate.
- Unquoted Gate sentence punctuation no longer rejects an existing executable;
  quoted and real dot-ending executable names remain literal.
- This version bump is required for native installers to replace 0.1.0 caches.
  Updating the marketplace alone does not refresh an unchanged plugin version.
- Warn-default remains unchanged. C7 is still explicitly unimplemented.

The implementation is marketplace PR #47. Live host, pin-content and Stop
acceptance are tracked separately by Project Factory BLA-744.
