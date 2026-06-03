#!/usr/bin/env bash
# Disaster-recovery drill.
#
# Restores a production snapshot to an isolated environment, applies migrations,
# loads the seed, runs the smoke test, and reports timing.
#
# Usage:
#   scripts/db/drill.sh <SNAPSHOT_URL> <RESTORE_DATABASE_URL>
set -euo pipefail

SNAPSHOT_URL="${1:?snapshot URL required}"
RESTORE_DATABASE_URL="${2:?restore database URL required}"

start=$(date +%s)
echo "drill: restore start $(date -u -Iseconds)"

# Provider-specific restore command would go here, for example:
#   neonctl branch create --restore-from-point "$SNAPSHOT_URL"
# or
#   aws rds restore-db-cluster-from-snapshot --snapshot-identifier "$SNAPSHOT_URL"
echo "  -> placeholder: provider-specific restore from ${SNAPSHOT_URL}"

echo "drill: apply migrations against restored database"
DATABASE_URL="$RESTORE_DATABASE_URL" npx prisma migrate deploy

echo "drill: seed"
DATABASE_URL="$RESTORE_DATABASE_URL" npx prisma db seed

echo "drill: smoke probe (against the application pointed at the restored db)"
# Application must be redeployed against $RESTORE_DATABASE_URL for this to be meaningful.
bash scripts/smoke.sh "${DRILL_BASE_URL:-http://localhost:3001}"

end=$(date +%s)
echo "drill: complete in $((end - start))s"
