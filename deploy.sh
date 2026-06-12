#!/bin/bash
set -e

# Accept optional commit message as argument, otherwise use timestamp
MSG="${1:-Update: $(date '+%Y-%m-%d %H:%M')}"

echo "→ Staging all changes..."
git add -A

# Only commit if there's something to commit
if git diff --cached --quiet; then
  echo "✓ Nothing new to commit."
else
  git commit -m "$MSG"
  echo "✓ Committed: $MSG"
fi

echo "→ Pushing to GitHub..."
git push origin main

echo ""
echo "✓ Done! Netlify will auto-deploy in ~2 minutes."
echo "  https://app.netlify.com/projects/cardcraftpro/deploys"
