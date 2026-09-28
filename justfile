# PRISM page commands.
set positional-arguments

[private]
default:
    @just --list --unsorted

# Video studio (no args) or factory command: `just video make <id>`, `just video list`.
video *args:
    #!/usr/bin/env bash
    set -euo pipefail
    cd apps/video
    if [[ $# -eq 0 ]]; then exec pnpm dev; fi
    case "$1" in
        dev|typecheck|lint|check) exec pnpm run "$1" ;;
        *) exec node scripts/video.mjs "$@" ;;
    esac

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

# Pull with rebase (normal start of a work session).
pull:
    @git pull --rebase

# Make the local branch match origin exactly; local changes are kept in a stash and a backup branch.
pull-force:
    #!/usr/bin/env bash
    set -euo pipefail
    branch=$(git branch --show-current)
    git fetch origin
    if [[ -n "$(git status --porcelain)" ]]; then
        git stash push -u -m "pull-force $(date +%F_%H%M%S)"
        echo "Uncommitted changes saved: git stash list"
    fi
    if [[ -n "$(git rev-list "origin/$branch..HEAD")" ]]; then
        backup="backup/$branch-$(date +%Y%m%d-%H%M%S)"
        git branch "$backup"
        echo "Local-only commits saved on $backup"
    fi
    git reset --hard "origin/$branch"
    git log --oneline -1
