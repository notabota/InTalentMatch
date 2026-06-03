Operations Scripts

Named read-only queries operators run against production through the ops bastion. Each script is a focused TypeScript file with a single purpose, documented at the top and runnable through tsx.

Convention:
  tsx scripts/ops/<name>.ts

Add a new script as a copy of an existing one. Keep them read-only; mutations belong under scripts/fixups/.
