#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

cd_root

log "Checking environment"
"$ROOT_DIR/scripts/check-env.sh"

log "Installing workspace dependencies"
pnpm install

log "Checking workspace structure"
"$ROOT_DIR/scripts/check-packages.sh"

log "Bootstrap complete"
