#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-${SMOKE_BASE_URL:-http://localhost:3001}}"
FAILED=0

check() {
  local path="$1"
  local expected="$2"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}")
  if [[ "$code" == "$expected" ]]; then
    echo "  OK  ${path} -> ${code}"
  else
    echo "FAIL  ${path} -> ${code} (expected ${expected})"
    FAILED=1
  fi
}

echo "Smoke test against ${BASE_URL}"
check "/" 200
check "/api/category" 200
check "/api/account" 404

if [[ "$FAILED" -ne 0 ]]; then
  echo "Smoke test failed"
  exit 1
fi
echo "Smoke test passed"
