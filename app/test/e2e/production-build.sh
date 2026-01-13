#!/bin/bash
set -e

# Production uses /community-box basename
BASE_URL="${BASE_URL:-http://localhost:4173/community-box}"

echo "🧪 Testing Production Build with /community-box basename"

# Build production version
echo "📦 Building production bundle..."
npm run build

# Start preview server
echo "🚀 Starting preview server..."
npm run preview &
PREVIEW_PID=$!
sleep 5

cleanup() {
  npx agent-browser close 2>/dev/null || true
  kill $PREVIEW_PID 2>/dev/null || true
}
trap cleanup EXIT

FAILED=0
FAILED_ROUTES=""

# Test critical routes with basename
echo -n "Testing: /community-box/ (home) ... "
npx agent-browser open "http://localhost:4173/community-box/" 2>/dev/null
npx agent-browser wait 3000 2>/dev/null || true
SNAPSHOT=$(npx agent-browser snapshot 2>/dev/null || echo "ERROR")
if echo "$SNAPSHOT" | grep -qi "Community Box\|Hardware\|Software" ; then
  echo "✅ PASSED"
else
  echo "❌ FAILED"
  FAILED=1
  FAILED_ROUTES="$FAILED_ROUTES\n  - /community-box/"
fi

echo -n "Testing: /community-box/questionnaire ... "
npx agent-browser open "http://localhost:4173/community-box/questionnaire" 2>/dev/null
npx agent-browser wait 3000 2>/dev/null || true
SNAPSHOT=$(npx agent-browser snapshot 2>/dev/null || echo "ERROR")
if echo "$SNAPSHOT" | grep -qi "404\|Not Found" ; then
  echo "❌ FAILED"
  FAILED=1
  FAILED_ROUTES="$FAILED_ROUTES\n  - /community-box/questionnaire"
else
  echo "✅ PASSED"
fi

echo -n "Testing: /community-box/docs/results/global-community-networks-directory ... "
npx agent-browser open "http://localhost:4173/community-box/docs/results/global-community-networks-directory" 2>/dev/null
npx agent-browser wait 3000 2>/dev/null || true
SNAPSHOT=$(npx agent-browser snapshot 2>/dev/null || echo "ERROR")
if echo "$SNAPSHOT" | grep -qi "Document Not Found\|404" ; then
  echo "❌ FAILED"
  FAILED=1
  FAILED_ROUTES="$FAILED_ROUTES\n  - /community-box/docs/results/global-community-networks-directory"
else
  echo "✅ PASSED"
fi

# Test JSON file with basename
echo -n "Testing: /community-box/research/results/community-directory.json ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4173/community-box/research/results/community-directory.json" 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
  echo "✅ PASSED"
else
  echo "❌ FAILED (HTTP $STATUS)"
  FAILED=1
  FAILED_ROUTES="$FAILED_ROUTES\n  - /community-box/research/results/community-directory.json (HTTP $STATUS)"
fi

npx agent-browser close 2>/dev/null || true

if [ $FAILED -eq 1 ]; then
  echo -e "\n❌ Production build tests failed:$FAILED_ROUTES"
  exit 1
fi

echo "🎉 Production build tests passed!"
