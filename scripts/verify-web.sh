#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

"$ROOT_DIR/scripts/check-env.sh"
require_dependencies

log "Typechecking web shell"
run_in_root pnpm --filter @facet/webapp typecheck

log "Building web shell"
run_in_root pnpm --filter @facet/webapp build
