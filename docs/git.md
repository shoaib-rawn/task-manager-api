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

---

## 3. Untangling Commits (Splitting Work into Separate Branches)

**The Scenario:**
You got into the zone and accidentally completed **two completely different features** (e.g., Day 11 and Day 12) back-to-back. You ran `git add .` and `git commit`, which bundled *both* features into one giant commit on a single branch. Now, you realize you made a mistake because you wanted them cleanly separated on two different feature branches.

**Why it happens:**
Git simply tracks the files you tell it to track. If you do work for multiple features without committing in between, Git will assume they belong together in the same "box" (commit).

**How to resolve it (The Soft Reset):**
You can use a "soft reset" to basically *un-commit* your work without actually deleting any of your code!

```bash
# 1. Un-do the last commit. 
# (This destroys the commit history but leaves all your modified files sitting safely in your code editor).
git reset HEAD~1

# 2. Create and switch to the first feature branch
git checkout -b feature/first-feature

# 3. Carefully add ONLY the files related to the first feature
git add file1.md file2.ts
git commit -m "feat: complete first feature"

# 4. Create and switch to the second feature branch
git checkout -b feature/second-feature

# 5. Add the remaining files for the second feature
git add file3.json file4.ts
git commit -m "feat: complete second feature"
```

**The Result:**
Your code was never lost or deleted! You simply took all the files out of the single combined box, and cleanly separated them into two distinct boxes (branches).
