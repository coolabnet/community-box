#!/bin/bash
set -e

# Production uses /community-box basename
BASE_URL="${BASE_URL:-http://localhost:4173/community-box}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
GHPAGES_PORT="${GHPAGES_PORT:-4179}"
GHPAGES_BASE="http://127.0.0.1:${GHPAGES_PORT}/community-box"
# Dedicated agent-browser session so this run never touches other browser sessions.
export AGENT_BROWSER_SESSION="cb-prod-e2e-$$"

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
BROWSER_OPENED=false
cleanup() {
  # Dry run starts no servers and must not touch the browser.
  if [ "$DRY_RUN" = true ]; then
    return 0
  fi
  # Close only the browser this run opened.
  if [ "$BROWSER_OPENED" = true ]; then
    npx agent-browser close 2>/dev/null || true
    BROWSER_OPENED=false
  fi
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
  BROWSER_OPENED=true
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
  echo "🚀 Starting GitHub Pages mimic server on 127.0.0.1:$GHPAGES_PORT..."
  set -m
  node "$SCRIPT_DIR/ghpages-server.mjs" &
  GHPAGES_PID=$!
  set +m

  # Readiness means a known-missing path returns 404 with the 404.html marker.
  # Vite preview answers unknown paths with index.html (200), so a taken port fails here.
  GHPAGES_404_MARKER="pathSegmentsToKeep"
  ghpages_probe_ok() {
    local url="${GHPAGES_BASE}/__ghpages_probe__"
    local status body
    status=$(curl -s -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || echo 000)
    [ "$status" = "404" ] || return 1
    body=$(curl -s "$url" 2>/dev/null || true)
    echo "$body" | grep -q "$GHPAGES_404_MARKER"
  }
  MAX_WAIT=30
  ELAPSED=0
  until ghpages_probe_ok; do
    if ! kill -0 "$GHPAGES_PID" 2>/dev/null; then
      echo "❌ GitHub Pages mimic server exited (port $GHPAGES_PORT in use?)"
      exit 1
    fi
    if [ $ELAPSED -ge $MAX_WAIT ]; then
      echo "❌ GitHub Pages mimic server did not answer the 404 probe with the 404.html marker within ${MAX_WAIT}s (port $GHPAGES_PORT)"
      exit 1
    fi
    sleep 1
    ELAPSED=$((ELAPSED + 1))
  done
  if ! kill -0 "$GHPAGES_PID" 2>/dev/null; then
    echo "❌ GitHub Pages mimic server exited after readiness (port $GHPAGES_PORT)"
    exit 1
  fi
  echo "✅ GitHub Pages mimic server ready (404 probe verified)"

  # Set English on this origin for the next load. Assertions do not depend on language.
  npx agent-browser open "$GHPAGES_BASE/" 2>/dev/null
  npx agent-browser eval "localStorage.setItem('i18nextLng','en')" 2>/dev/null || true

  # Expected values are read at runtime from the repo, so the checks follow content changes.
  # Doc H1 comes from research/guides/etcher-guide.md; question and error strings from en.json.
  DOC_JS=$(APP_DIR="$APP_DIR" node -e '
const fs = require("fs");
const path = require("path");
const app = process.env.APP_DIR;
const en = JSON.parse(fs.readFileSync(path.join(app, "src/i18n/locales/en.json"), "utf8"));
const errs = JSON.stringify(Object.values(en.errors || {}).filter((v) => typeof v === "string" && !v.includes("{{")));
const md = fs.readFileSync(path.join(app, "../research/guides/etcher-guide.md"), "utf8");
const h1 = md.split("\n").find((l) => /^# /.test(l)).slice(2).trim();
process.stdout.write("(() => { const ERRS = " + errs + "; const EXPECTED = " + JSON.stringify(h1) + "; " +
  "if (location.pathname !== \x27/community-box/docs/guides/etcher-guide\x27) return \x27FAIL pathname=\x27 + location.pathname; " +
  "if (location.hash !== \x27#top\x27) return \x27FAIL hash=\x27 + location.hash; " +
  "const h1 = document.querySelector(\x27h1\x27); const text = h1 ? h1.textContent.trim() : \x27\x27; " +
  "if (text !== EXPECTED) return \x27FAIL h1=\x27 + text.slice(0, 80); " +
  "const heads = Array.from(document.querySelectorAll(\x27h1,h2,h3\x27)).map((e) => e.textContent.trim()); " +
  "if (heads.some((t) => /404|not found/i.test(t))) return \x27FAIL not-found heading\x27; " +
  "if (document.querySelector(\x27h2.text-red-600\x27)) return \x27FAIL doc-not-found marker\x27; " +
  "const body = document.body ? document.body.innerText : \x27\x27; " +
  "if (ERRS.some((s) => body.includes(s))) return \x27FAIL error boundary text\x27; " +
  "return \x27PASS\x27; })()");
') || { echo "❌ Could not build doc assertions"; exit 1; }
  QS_JS=$(APP_DIR="$APP_DIR" node -e '
const fs = require("fs");
const path = require("path");
const app = process.env.APP_DIR;
const en = JSON.parse(fs.readFileSync(path.join(app, "src/i18n/locales/en.json"), "utf8"));
const errs = JSON.stringify(Object.values(en.errors || {}).filter((v) => typeof v === "string" && !v.includes("{{")));
const question = en.questionnaire.questions.growth.question;
process.stdout.write("(() => { const ERRS = " + errs + "; const QUESTION = " + JSON.stringify(question) + "; " +
  "if (location.pathname !== \x27/community-box/questionnaire\x27) return \x27FAIL pathname=\x27 + location.pathname; " +
  "const sp = new URLSearchParams(location.search); " +
  "if (sp.get(\x27step\x27) !== \x272\x27 || sp.get(\x27electricity\x27) !== \x27yes\x27 || sp.get(\x27users\x27) !== \x271-2\x27) return \x27FAIL search=\x27 + location.search; " +
  "const heads = Array.from(document.querySelectorAll(\x27h1,h2,h3\x27)).map((e) => e.textContent.trim()); " +
  "if (!heads.includes(QUESTION)) return \x27FAIL question heading missing\x27; " +
  "const body = document.body ? document.body.innerText : \x27\x27; " +
  "if (ERRS.some((s) => body.includes(s))) return \x27FAIL error boundary text\x27; " +
  "return \x27PASS\x27; })()");
') || { echo "❌ Could not build questionnaire assertions"; exit 1; }

  echo -n "Testing: deep link /docs/guides/etcher-guide#top (404.html redirect) ... "
  npx agent-browser open "$GHPAGES_BASE/docs/guides/etcher-guide#top" 2>/dev/null
  npx agent-browser wait 3000 2>/dev/null || true
  RESULT=$(npx agent-browser eval "$DOC_JS" 2>/dev/null || echo "ERROR")
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
  RESULT=$(npx agent-browser eval "$QS_JS" 2>/dev/null || echo "ERROR")
  if echo "$RESULT" | grep -q "PASS"; then
    echo "✅ PASSED"
  else
    echo "❌ FAILED ($RESULT)"
    FAILED=1
    FAILED_ROUTES="$FAILED_ROUTES\n  - /community-box/questionnaire?step=2&electricity=yes&users=1-2 (deep link)"
  fi
fi

if [ "$BROWSER_OPENED" = true ]; then
  npx agent-browser close 2>/dev/null || true
  BROWSER_OPENED=false
fi

if [ $FAILED -eq 1 ]; then
  echo -e "\n❌ Production build tests failed:$FAILED_ROUTES"
  exit 1
fi

echo "🎉 Production build tests passed!"
