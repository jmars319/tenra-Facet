#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

required_paths=(
  "apps/webapp/package.json"
  "apps/webapp/next.config.js"
  "apps/desktopapp/package.json"
  "apps/desktopapp/src-tauri/tauri.conf.json"
  "apps/mobileapp/package.json"
  "apps/mobileapp/app.json"
  "packages/shared-types/src/index.ts"
  "packages/domain/src/index.ts"
  "packages/api-contracts/src/index.ts"
  "packages/validation/src/index.ts"
  "packages/search-providers/src/index.ts"
  "packages/reframing/src/index.ts"
  "packages/safety/src/index.ts"
  "packages/auth/src/index.ts"
  "packages/privacy/src/index.ts"
  "packages/ui/src/index.ts"
  "packages/config/src/index.ts"
  "packages/optional-realtime/src/index.ts"
  "packages/optional-geo/src/index.ts"
  "scripts/bootstrap.sh"
  "scripts/check-env.sh"
  "scripts/check-packages.sh"
  "scripts/dev-web.sh"
  "scripts/dev-desktop.sh"
  "scripts/dev-mobile.sh"
  "scripts/dev-both.sh"
  "scripts/verify-web.sh"
  "scripts/verify-desktop.sh"
  "scripts/verify-mobile.sh"
  "scripts/verify-all.sh"
  "scripts/doctor.sh"
  "docs/DEVELOPER_GUIDE.md"
  "docs/NEGATIVE_SPEC.md"
  "docs/REPO_MAP.md"
  "docs/STABILITY_CHECKLIST.md"
  "docs/ARCHITECTURE_NOTES.md"
  "README.md"
)

missing=()

for path in "${required_paths[@]}"; do
  if [[ ! -e "$ROOT_DIR/$path" ]]; then
    missing+=("$path")
  fi
done

if (( ${#missing[@]} > 0 )); then
  printf "error: Missing required path: %s\n" "${missing[@]}" >&2
  exit 1
fi

log "Workspace paths verified"
