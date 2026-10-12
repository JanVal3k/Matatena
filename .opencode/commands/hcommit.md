---
description: Review, verify, and commit current changes
---

Follow the Git workflow rules defined in @AGENTS.md.

1. Inspect `git status` and review all changes using `git diff` and `git diff --cached`.
2. Check for accidentally included secrets, credentials, generated files, or unrelated changes. Never stage sensitive files.
3. Run `npm run typecheck`, `npm test`, and `npm run build` when applicable. If a command fails, report the failure and do not commit.
4. Stage the relevant changes using `git add -A`, excluding unrelated or sensitive files.
5. Review the staged changes using `git diff --cached`.
6. Create a commit with a concise, descriptive message in English. If the user supplied a message in $ARGUMENTS, use it as the commit message; otherwise, generate an appropriate one.
7. Do not push to GitHub.
8. Report the commit hash, message, and verification results.

Never use destructive Git commands or amend existing commits unless explicitly requested.