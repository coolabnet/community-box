#!/bin/bash
set -e

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "🧪 Testing All Routes from Research Folder"

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

ROUTE_COUNT=0
FAILED_COUNT=0
FAILED_ROUTES=""

echo "🔍 Scanning research folder for markdown files..."

# Get the script's directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Find all .md files in the research directory
shopt -s globstar nullglob
for mdfile in "$PROJECT_ROOT"/research/**/*.md; do
  [ -f "$mdfile" ] || continue
  
  # Skip empty README files (0 bytes)
  if [ ! -s "$mdfile" ]; then
    continue
  fi
  
  # Convert file path to route path
  # /path/to/research/hardware/intel_nuc/nuc-overview.md -> hardware/intel_nuc/nuc-overview
  route="${mdfile#$PROJECT_ROOT/research/}"
  route="${route%.md}"

  echo -n "Testing: /docs/$route ... "
  
  npx agent-browser open "$BASE_URL/docs/$route" 2>/dev/null
  npx agent-browser wait 3000 2>/dev/null || true
  
  # Check for 404 indicators - only match exact error messages, not ref=e404
  SNAPSHOT=$(npx agent-browser snapshot 2>/dev/null || echo "ERROR")
  
  if echo "$SNAPSHOT" | grep -q 'heading "Document Not Found"' ; then
    echo "❌ FAILED"
    FAILED_COUNT=$((FAILED_COUNT + 1))
    FAILED_ROUTES="$FAILED_ROUTES\n  - /docs/$route"
  elif echo "$SNAPSHOT" | grep -q 'Document .* not found or failed to load' ; then
    echo "❌ FAILED"
    FAILED_COUNT=$((FAILED_COUNT + 1))
    FAILED_ROUTES="$FAILED_ROUTES\n  - /docs/$route"
  else
    echo "✅ PASSED"
  fi

  ROUTE_COUNT=$((ROUTE_COUNT + 1))
done

npx agent-browser close 2>/dev/null || true

echo ""
echo "📊 Test Results:"
echo "  Total routes tested: $ROUTE_COUNT"
echo "  Failed: $FAILED_COUNT"

if [ $FAILED_COUNT -gt 0 ]; then
  echo -e "❌ Failed routes:$FAILED_ROUTES"
  exit 1
fi

echo "🎉 All routes passed!"