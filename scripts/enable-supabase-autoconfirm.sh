#!/usr/bin/env bash
set -euo pipefail

PROJECT_REF="ginszpwyfzxgtttribox"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "SUPABASE_ACCESS_TOKEN is required." >&2
  echo "Create a Supabase access token and run:" >&2
  echo "SUPABASE_ACCESS_TOKEN=... scripts/enable-supabase-autoconfirm.sh" >&2
  exit 1
fi

curl -sS -X PATCH "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"mailer_autoconfirm":true}' \
  | python3 -m json.tool

echo
echo "Requested mailer_autoconfirm=true for ${PROJECT_REF}."
