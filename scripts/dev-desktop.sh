#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

require_dependencies
require_rust_toolchain
run_in_root pnpm --filter @facet/desktopapp tauri:dev
