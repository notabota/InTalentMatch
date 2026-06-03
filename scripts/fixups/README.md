Data Fixup Scripts

One-off mutating scripts for ad-hoc data fixes. Every script is committed in a PR, reviewed, then executed by a designated operator. Every run is logged.

Convention:
  scripts/fixups/<YYYY-MM-DD>-<short-purpose>.ts

Each script:
  - documents the incident at the top in a comment block,
  - is idempotent where possible (re-running is a no-op once applied),
  - prints the row counts it touches.

Run with:
  tsx scripts/fixups/<file>.ts
