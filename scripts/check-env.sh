#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

require_command node
require_command pnpm

require_min_major "node" "$(node --version)" 22
require_min_major "pnpm" "$(pnpm --version)" 10

if has_command cargo && has_command rustc; then
  log "cargo $(cargo --version | awk '{print $2}')"
  log "rustc $(rustc --version | awk '{print $2}')"
else
  warn "Rust toolchain not detected. Desktop dev and verify scripts will fail until cargo and rustc are installed."
fi
