#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

"$ROOT_DIR/scripts/check-env.sh"
require_dependencies

log "Typechecking mobile shell"
run_in_root pnpm --filter @facet/mobileapp typecheck

log "Building mobile shell"
run_in_root pnpm --filter @facet/mobileapp build
