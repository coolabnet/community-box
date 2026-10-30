#!/bin/bash
set -e

# Production uses /community-box basename
BASE_URL="${BASE_URL:-http://localhost:4173/community-box}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GHPAGES_PORT="${GHPAGES_PORT:-4174}"
GHPAGES_BASE="http://localhost:${GHPAGES_PORT}/community-box"

# Parse arguments
DRY_RUN=false
for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      ;;
  esac
done

PREVIEW_PID=""
GHPAGES_PID=""
cleanup() {
  # Dry run starts no servers and must not touch the browser.
  if [ "$DRY_RUN" = true ]; then
    return 0
  fi
  npx agent-browser close 2>/dev/null || true
  # Servers run in their own process group (set -m), so kill the whole group:
  # killing npm alone leaves the vite child running.
  [ -n "$PREVIEW_PID" ] && { kill -- -"$PREVIEW_PID" 2>/dev/null || kill "$PREVIEW_PID" 2>/dev/null || true; }
  [ -n "$GHPAGES_PID" ] && { kill -- -"$GHPAGES_PID" 2>/dev/null || kill "$GHPAGES_PID" 2>/dev/null || true; }
  return 0
}
trap cleanup EXIT

echo "🧪 Testing Production Build with /community-box basename"

if [ "$DRY_RUN" = true ]; then
  echo "🔍 [DRY RUN] Would build and test production bundle"
fi

# Build production version
if [ "$DRY_RUN" = true ]; then
  echo "🔍 [DRY RUN] Would run: npm run build"
  echo "🔍 [DRY RUN] Would start preview server"
else
  echo "📦 Building production bundle..."
  npm run build

  # Start preview server
  echo "🚀 Starting preview server..."
  set -m
  npm run preview &
  PREVIEW_PID=$!
  set +m
  # Poll for server readiness instead of fixed sleep
  MAX_WAIT=30
  INTERVAL=1
  ELAPSED=0
  while [ $ELAPSED -lt $MAX_WAIT ]; do
    if curl -s "$BASE_URL" > /dev/null 2>&1; then
      echo "✅ Preview server ready"
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
fi

FAILED=0
FAILED_ROUTES=""

# Test critical routes with basename
if [ "$DRY_RUN" = true ]; then
  echo "[DRY RUN] Would test: /community-box/ (home)"
  echo "[DRY RUN] Would test: /community-box/questionnaire"
  echo "[DRY RUN] Would test: /community-box/docs/results/global-community-networks-directory"
  echo "[DRY RUN] Would test: /community-box/research/results/community-directory.json"
  echo "[DRY RUN] Would test: /community-box/docs/guides/etcher-guide#top (GitHub Pages 404.html deep link with hash)"
  echo "[DRY RUN] Would test: /community-box/questionnaire?step=2&electricity=yes&users=1-2 (GitHub Pages 404.html deep link with query)"
  echo ""
  echo "🔍 [DRY RUN] No actual tests were executed"
  exit 0
else
  echo -n "Testing: /community-box/ (home) ... "
  # Pin English for the whole run: the existing greps expect English strings.
  npx agent-browser open "$BASE_URL/" 2>/dev/null
  npx agent-browser eval "localStorage.setItem('i18nextLng','en')" 2>/dev/null || true
  npx agent-browser open "$BASE_URL/" 2>/dev/null
  npx agent-browser wait 3000 2>/dev/null || true
  SNAPSHOT=$(npx agent-browser snapshot 2>/dev/null || echo "ERROR")
  if echo "$SNAPSHOT" | grep -qi "Community Box\|Hardware\|Software" ; then
    echo "✅ PASSED"
  else
    echo "❌ FAILED"
    FAILED=1
    FAILED_ROUTES="$FAILED_ROUTES\n  - /community-box/"
  fi

  echo -n "Testing: /questionnaire ... "
  npx agent-browser open "$BASE_URL/questionnaire" 2>/dev/null
  npx agent-browser wait 3000 2>/dev/null || true
  SNAPSHOT=$(npx agent-browser snapshot 2>/dev/null || echo "ERROR")
  if echo "$SNAPSHOT" | grep -qi "404\|Not Found" ; then
    echo "❌ FAILED"
    FAILED=1
    FAILED_ROUTES="$FAILED_ROUTES\n  - /community-box/questionnaire"
  else
    echo "✅ PASSED"
  fi

  echo -n "Testing: /docs/results/global-community-networks-directory ... "
  npx agent-browser open "$BASE_URL/docs/results/global-community-networks-directory" 2>/dev/null
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
  echo -n "Testing: /research/results/community-directory.json ... "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/research/results/community-directory.json" 2>/dev/null || echo "000")
  if [ "$STATUS" = "200" ]; then
    echo "✅ PASSED"
  else
    echo "❌ FAILED (HTTP $STATUS)"
    FAILED=1
    FAILED_ROUTES="$FAILED_ROUTES\n  - /community-box/research/results/community-directory.json (HTTP $STATUS)"
  fi

  # GitHub Pages deep links. vite preview has its own SPA fallback and never
  # serves dist/404.html, so the checks above cannot exercise the
  # 404.html -> /?/path -> receiver round trip. ghpages-server.mjs serves
  # dist/404.html on misses, like GitHub Pages does.
  echo "🚀 Starting GitHub Pages mimic server on port $GHPAGES_PORT..."
  set -m
  node "$SCRIPT_DIR/ghpages-server.mjs" &
  GHPAGES_PID=$!
  set +m
  MAX_WAIT=30
  ELAPSED=0
  until curl -s -o /dev/null "$GHPAGES_BASE/" 2>/dev/null; do
    if [ $ELAPSED -ge $MAX_WAIT ]; then
      echo "❌ GitHub Pages mimic server failed to start within ${MAX_WAIT}s (port $GHPAGES_PORT)"
      exit 1
    fi
    sleep 1
    ELAPSED=$((ELAPSED + 1))
  done
  echo "✅ GitHub Pages mimic server ready"

  # Set English on this origin for the next load. Assertions do not depend on language.
  npx agent-browser open "$GHPAGES_BASE/" 2>/dev/null
  npx agent-browser eval "localStorage.setItem('i18nextLng','en')" 2>/dev/null || true

  echo -n "Testing: deep link /docs/guides/etcher-guide#top (404.html redirect) ... "
  npx agent-browser open "$GHPAGES_BASE/docs/guides/etcher-guide#top" 2>/dev/null
  npx agent-browser wait 3000 2>/dev/null || true
  RESULT=$(npx agent-browser eval "(() => { const p = location.pathname; const h = location.hash; const h1 = document.querySelector('h1'); const t = h1 ? h1.textContent.trim() : ''; if (p !== '/community-box/docs/guides/etcher-guide') return 'FAIL pathname=' + p; if (h !== '#top') return 'FAIL hash=' + h; if (!t) return 'FAIL no h1 text'; if (document.querySelector('h2.text-red-600')) return 'FAIL doc-not-found marker'; return 'PASS h1=' + t.slice(0, 60); })()" 2>/dev/null || echo "ERROR")
  if echo "$RESULT" | grep -q "PASS"; then
    echo "✅ PASSED"
  else
    echo "❌ FAILED ($RESULT)"
    FAILED=1
    FAILED_ROUTES="$FAILED_ROUTES\n  - /community-box/docs/guides/etcher-guide#top (deep link)"
  fi

  echo -n "Testing: deep link /questionnaire?step=2&electricity=yes&users=1-2 ... "
  npx agent-browser open "$GHPAGES_BASE/questionnaire?step=2&electricity=yes&users=1-2" 2>/dev/null
  npx agent-browser wait 3000 2>/dev/null || true
  RESULT=$(npx agent-browser eval "(() => { const p = location.pathname; const s = location.search; if (p !== '/community-box/questionnaire') return 'FAIL pathname=' + p; if (s.indexOf('step=2') < 0 || s.indexOf('electricity=yes') < 0 || s.indexOf('users=1-2') < 0) return 'FAIL search=' + s; const btns = Array.from(document.querySelectorAll('button')).filter((b) => b.getClientRects().length > 0); if (btns.length === 0) return 'FAIL no visible button'; return 'PASS buttons=' + btns.length; })()" 2>/dev/null || echo "ERROR")
  if echo "$RESULT" | grep -q "PASS"; then
    echo "✅ PASSED"
  else
    echo "❌ FAILED ($RESULT)"
    FAILED=1
    FAILED_ROUTES="$FAILED_ROUTES\n  - /community-box/questionnaire?step=2&electricity=yes&users=1-2 (deep link)"
  fi
fi

npx agent-browser close 2>/dev/null || true

if [ $FAILED -eq 1 ]; then
  echo -e "\n❌ Production build tests failed:$FAILED_ROUTES"
  exit 1
fi

echo "🎉 Production build tests passed!"
