# 🐙 Git Practice & Cheat Sheet

This document serves as a living record of Git scenarios, commands, and best practices learned throughout the daily backend development journey.

---

## 1. Branch is "Behind" Main (Syncing Branches)

**The Scenario:**
You check your branch status or GitHub, and it says `dev is 1 commit behind main`.

**Why it happens:**
When you merge a Pull Request, GitHub often creates a new "Merge Commit" on the `main` branch. Because that commit was created on `main`, your local `dev` branch doesn't have it yet. It can also happen if an emergency hotfix is pushed directly to `main`.

**The Best Practice Solution (Back-merging):**
You must sync `main` back into your `dev` branch to ensure your development environment is fully up-to-date with production.

```bash
# 1. Switch to the main branch
git checkout main

# 2. Pull the latest changes from GitHub
git pull origin main

# 3. Switch back to your development branch
git checkout dev

# 4. Merge the updated main into dev
git merge main

# 5. Push the synced dev branch back to GitHub
git push origin dev
```
*Note: This works the exact same way whether you are 1 commit behind or 100 commits behind. Git will automatically apply all missing commits.*

---

## 2. Merge Conflicts and Markers

**The Scenario:**
You attempt to run `git merge` or `git pull`, but Git stops and says: `Automatic merge failed; fix conflicts and then commit the result.`

**Why it happens:**
Being "behind" on commits does *not* cause conflicts. A conflict **ONLY** happens when:
1. You modified a specific line of code on your current branch.
2. Someone else (or you, on another branch) modified that **exact same line** of code.

Because the same line was changed differently in two places, Git does not know which version to keep. It pauses the merge and asks for your human input.

**How to resolve it:**
Git will insert conflict markers into the file where the collision happened:

```text
<<<<<<< HEAD (Current Branch)
PORT=8080
=======
PORT=3000
>>>>>>> main (Incoming Branch)
```

**The Fix:**
1. Open the file in your code editor (VS Code will usually highlight these blocks in green and blue).
2. Decide which code is correct (or combine them if necessary).
3. Delete the marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Save the file.
5. Tell Git you fixed it by running:
   ```bash
   git add <filename>
   git commit -m "fix: resolve merge conflicts"
   ```
