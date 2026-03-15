#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

require_dependencies
require_rust_toolchain

cleanup() {
  if [[ -n "${web_pid:-}" ]]; then
    kill "$web_pid" 2>/dev/null || true
  fi

  if [[ -n "${desktop_pid:-}" ]]; then
    kill "$desktop_pid" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

run_in_root pnpm --filter @facet/webapp dev &
web_pid=$!

run_in_root pnpm --filter @facet/desktopapp tauri:dev &
desktop_pid=$!

wait "$web_pid"
wait "$desktop_pid"
