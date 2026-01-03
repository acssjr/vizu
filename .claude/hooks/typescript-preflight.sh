#!/bin/bash
set -e

# TypeScript Pre-flight Check Hook
# Runs after Edit/Write on .ts/.tsx files

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Use project hooks
if [ -f "$SCRIPT_DIR/dist/typescript-preflight.mjs" ]; then
    cd "$SCRIPT_DIR"
    cat | node dist/typescript-preflight.mjs
else
    # Fallback: just continue if hook not built
    echo '{"result":"continue"}'
fi
