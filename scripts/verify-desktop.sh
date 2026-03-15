#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

"$ROOT_DIR/scripts/check-env.sh"
require_dependencies
require_rust_toolchain

log "Typechecking desktop shell"
run_in_root pnpm --filter @facet/desktopapp typecheck

log "Building desktop shell"
run_in_root pnpm --filter @facet/desktopapp build
