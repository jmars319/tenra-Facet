#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

log "Running environment checks"
"$ROOT_DIR/scripts/check-env.sh"

log "Running workspace checks"
"$ROOT_DIR/scripts/check-packages.sh"

require_dependencies

log "Running full verification"
"$ROOT_DIR/scripts/verify-all.sh"
