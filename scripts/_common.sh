#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() {
  printf "==> %s\n" "$*"
}

warn() {
  printf "warning: %s\n" "$*" >&2
}

fail() {
  printf "error: %s\n" "$*" >&2
  exit 1
}

cd_root() {
  cd "$ROOT_DIR"
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

require_command() {
  has_command "$1" || fail "Missing required command: $1"
}

version_major() {
  local version="${1#v}"
  printf "%s\n" "${version%%.*}"
}

require_min_major() {
  local label="$1"
  local version="$2"
  local minimum="$3"
  local major

  major="$(version_major "$version")"

  [[ "$major" =~ ^[0-9]+$ ]] || fail "Could not parse $label version from '$version'."
  (( major >= minimum )) || fail "$label $version found, but $label >= $minimum is required."

  log "$label $version"
}

require_dependencies() {
  [[ -d "$ROOT_DIR/node_modules" ]] || fail "Dependencies are not installed. Run 'pnpm bootstrap' first."
}

require_rust_toolchain() {
  require_command cargo
  require_command rustc
  log "cargo $(cargo --version | awk '{print $2}')"
  log "rustc $(rustc --version | awk '{print $2}')"
}

run_in_root() {
  (
    cd "$ROOT_DIR"
    "$@"
  )
}
