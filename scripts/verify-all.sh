#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

"$ROOT_DIR/scripts/check-env.sh"
"$ROOT_DIR/scripts/check-packages.sh"
require_dependencies

log "Linting workspace"
run_in_root pnpm lint

log "Typechecking workspace"
run_in_root pnpm typecheck

log "Verifying web shell"
"$ROOT_DIR/scripts/verify-web.sh"

log "Verifying desktop shell"
"$ROOT_DIR/scripts/verify-desktop.sh"

log "Verifying mobile shell"
"$ROOT_DIR/scripts/verify-mobile.sh"

log "Workspace verification complete"
