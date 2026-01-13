#!/bin/bash
set -e

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "🧪 Testing Link Integrity (Issue #11 Critical Routes)"

# Check if dev server is already running
if ! curl -s "$BASE_URL" > /dev/null 2>&1; then
  echo "📦 Starting dev server..."
  npm run dev &
  DEV_PID=$!
  sleep 8
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

if [ $FAILED -eq 1 ]; then
  echo -e "\n❌ Link integrity tests failed:$FAILED_ROUTES"
  exit 1
fi

echo "🎉 All link integrity tests passed!"
