#!/usr/bin/env bash
# Playa OS — Build script (Mac/Linux)
# Délègue à Python3 (fiable) ou PowerShell si disponible
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

if command -v pwsh &>/dev/null; then
  pwsh "$ROOT/build.ps1"
elif command -v python3 &>/dev/null; then
  python3 "$ROOT/build.py"
else
  echo "Erreur : ni pwsh ni python3 disponibles" >&2
  exit 1
fi
