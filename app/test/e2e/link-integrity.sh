#!/bin/bash
set -e

BASE_URL="${BASE_URL:-http://localhost:8080}"

# Parse arguments
DRY_RUN=false
for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      ;;
  esac
done

echo "🧪 Testing Link Integrity (Issue #11 Critical Routes)"

if [ "$DRY_RUN" = true ]; then
  echo "🔍 [DRY RUN] Would scan routes without executing tests"
fi

# Check if dev server is already running
if [ "$DRY_RUN" = true ]; then
  echo "🔍 [DRY RUN] Would start dev server if not running"
elif ! curl -s "$BASE_URL" > /dev/null 2>&1; then
  echo "📦 Starting dev server..."
  npm run dev &
  DEV_PID=$!
  # Poll for server readiness instead of fixed sleep
  MAX_WAIT=30
  INTERVAL=1
  ELAPSED=0
  while [ $ELAPSED -lt $MAX_WAIT ]; do
    if curl -s "$BASE_URL" > /dev/null 2>&1; then
      echo "✅ Dev server ready"
      break
    fi
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
    echo "Waiting for server... ${ELAPSED}s"
  done
  if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo "❌ Server failed to start within ${MAX_WAIT}s"
    exit 1
  fi
  STARTED_SERVER=true
else
  echo "✅ Dev server already running"
  STARTED_SERVER=false
fi

cleanup() {
  npx agent-browser close 2>/dev/null || true
  if [ "$STARTED_SERVER" = true ] && [ -n "$DEV_PID" ]; then
    kill $DEV_PID 2>/dev/null || true
  fi
}
trap cleanup EXIT

# Critical routes from Issue #11
ROUTES=(
  "/questionnaire"
  "/docs/results/global-community-networks-directory"
)

# Additional important routes
ROUTES+=(
  "/docs/hardware/intel_nuc/nuc-overview"
  "/docs/hardware/raspberry_pi_5/rpi-overview"
  "/docs/hardware/zimaboard/zima-overview"
  "/docs/software/yunohost/README"
  "/docs/software/caprover/README"
  "/docs/software/casaos/README"
  "/docs/guides/libremesh-overview"
  "/docs/guides/mesh-network-basics"
)

FAILED=0
FAILED_ROUTES=""

for route in "${ROUTES[@]}"; do
  if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would test: $route"
    continue
  fi

  echo -n "Testing: $route ... "
  
  npx agent-browser open "$BASE_URL$route" 2>/dev/null
  npx agent-browser wait 3000 2>/dev/null || true

  # Check for 404 indicators
  SNAPSHOT=$(npx agent-browser snapshot 2>/dev/null || echo "ERROR")
  
  if echo "$SNAPSHOT" | grep -qi "404\|Not Found\|Document Not Found\|error loading" ; then
    echo "❌ FAILED"
    FAILED=1
    FAILED_ROUTES="$FAILED_ROUTES\n  - $route"
  else
    echo "✅ PASSED"
  fi
done

# Test JSON file accessibility (this is a key Issue #11 bug)
if [ "$DRY_RUN" = true ]; then
  echo "[DRY RUN] Would test: /research/results/community-directory.json (raw file)"
else
  echo -n "Testing: /research/results/community-directory.json (raw file) ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/research/results/community-directory.json" 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
  echo "✅ PASSED"
else
  echo "❌ FAILED (HTTP $STATUS)"
  FAILED=1
  FAILED_ROUTES="$FAILED_ROUTES\n  - /research/results/community-directory.json (HTTP $STATUS)"
fi

npx agent-browser close 2>/dev/null || true

if [ "$DRY_RUN" = true ]; then
  echo ""
  echo "🔍 [DRY RUN] No actual tests were executed"
  exit 0
fi

if [ $FAILED -eq 1 ]; then
  echo -e "\n❌ Link integrity tests failed:$FAILED_ROUTES"
  exit 1
fi

echo "🎉 All link integrity tests passed!"
