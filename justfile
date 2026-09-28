# PRISM page commands.
set positional-arguments

[private]
default:
    @just --list --unsorted

# Video: dev, render, render:site, typecheck, lint, still.
video action='dev':
    @cd apps/video && pnpm run "$1"

# Stage all changes and commit with a message based on the changed files.
com:
    #!/usr/bin/env bash
    set -euo pipefail
    git add -A
    if git diff --cached --quiet; then
        echo "Nothing to commit."
        exit 0
    fi
    count=$(git diff --cached --name-only | wc -l)
    first=$(git diff --cached --name-only | sed -n '1p')
    if [[ "$count" -eq 1 ]]; then
        message="Update $first"
    else
        message="Update $first and $((count - 1)) more files"
    fi
    git commit -m "$message"

# Commit pending changes, then push the current branch.
push: com
    @git push
