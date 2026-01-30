# 📚 Introduction to Git (Version Control)

This guide explains what Git is, why it matters, and how it is used in this project. Don't worry: **You don't need to learn Git commands.** The AI Agent handles everything for you. But you need to understand the concept and ensure Git is installed on your computer.

---

## 🤔 What is Git?

Imagine you are writing a long essay. You make changes, delete paragraphs, add new ideas. Sometimes you think: *"I liked the version from yesterday better!"* But it's gone. You saved over it.

**Git solves this problem.**

Git is a **Version Control System**. It keeps track of every change you make to your files. Think of it like:

*   📸 **A photo album of your project:** Every time you "save" (in Git: "commit"), Git takes a snapshot of your entire project.
*   ⏪ **A time machine:** You can go back to any previous snapshot if something goes wrong.
*   🎮 **Save points in a video game:** Before a boss fight, you save. If you die, you reload. Git works the same way for code.

Git was invented in 2005 by Linus Torvalds (the creator of Linux) and is now used by virtually every software company in the world.

---

## 💡 Why is Git useful?

| Problem | How Git solves it |
|---------|-------------------|
| "I accidentally deleted important code!" | Git remembers every version. You can restore it. |
| "My code worked yesterday, now it's broken!" | Git shows you exactly what changed between versions. |
| "I want to try something risky without breaking everything." | Git lets you experiment safely. If it fails, you revert. |
| "Multiple people are working on the same project." | Git merges everyone's changes together (not relevant for this course, but good to know). |

---

## 📖 Key Concepts (Vocabulary)

### 1. Repository (Repo)
A **Repository** is simply a folder that Git is watching. Your project folder becomes a "Git Repository" when you initialize Git in it.

*In this project:* The entire folder you unzipped is (or will become) a Git Repository.

### 2. Commit
A **Commit** is a "snapshot" or "save point". When you commit, Git records the current state of all your files.

*Analogy:* If your project were a Word document, a Commit would be like clicking "Save As" with a new version number: `project_v1.docx`, `project_v2.docx`, etc. But Git does this automatically and much more elegantly.

*In this project:* Every time you run `/sprinter-complete`, the AI creates a Commit with a message like: `"Sprint 1.1: Basic Game Loop"`.

### 3. Commit Message
Every Commit has a short description explaining **what changed**. This helps you (and others) understand the history of the project.

*Example:*
```
Sprint 1.1: Basic Game Loop
Sprint 1.2: Added Collision Detection
Sprint 1.3: Implemented Multiplayer
```

### 4. History / Log
Git keeps a **Log** of all Commits. You can see the entire history of your project: who changed what, when, and why.

*In this project:* Each Sprint creates one Commit. At the end, you have a clean history of your development process.

### 5. Working Directory
The **Working Directory** is simply your project folder as you see it right now. When you edit files, you are changing the Working Directory. These changes are not saved to Git until you Commit.

---

## 🤖 How Git is used in this project

**Important:** You do NOT need to type Git commands yourself.

The **Sprinter Agent** handles Git for you. Here's what happens behind the scenes:

| You do this | The Agent does this (Git) |
|-------------|---------------------------|
| `/sprinter-start` | Reads your Roadmap, starts coding |
| Test the result, give feedback | Fixes bugs, iterates |
| `/sprinter-complete` | Runs `git add .` and `git commit -m "Sprint X.Y: ..."` |

**What does that mean?**
*   `git add .` → "Prepare all changed files for the snapshot"
*   `git commit -m "..."` → "Take the snapshot and label it"

You just need to make sure Git is installed so the Agent can use it.

---

## 🛠️ Installation Guide

### 🍎 For macOS Users

Git is usually pre-installed on macOS, but not always. Follow these steps to check and install if needed.

**Step 1: Check if Git is installed**
1.  Open **Terminal** (press `Cmd + Space`, type "Terminal", press Enter).
2.  Type: `git --version`
3.  Press Enter.

**Step 2: Interpret the result**
*   ✅ If you see something like `git version 2.39.0`: **You're done!** Git is installed.
*   ❌ If you see `command not found` or a popup appears: Continue to Step 3.

**Step 3: Install Git (if not installed)**

You have three options:

**Option A: Automatic Popup (Easiest)**
Sometimes, macOS will show a popup asking to install "Command Line Developer Tools". If this appears:
1.  Click **Install**.
2.  Wait for the installation to complete (can take 5-10 minutes).
3.  Verify by running `git --version` again.

**Option B: Install via Homebrew (Recommended for Developers)**
Homebrew is a package manager for macOS. If you have it installed:
1.  Open Terminal.
2.  Type: `brew install git`
3.  Press Enter and wait.
4.  Verify: `git --version`

If you don't have Homebrew, you can install it first by running:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Then run `brew install git`.

**Option C: Direct Download**
1.  Go to: [https://git-scm.com/download/mac](https://git-scm.com/download/mac)
2.  Download the installer.
3.  Open the `.dmg` file and follow the instructions.
4.  Verify: Open Terminal and type `git --version`.

---

### 🪟 For Windows Users

Git is usually NOT pre-installed on Windows.

**Step 1: Download Git**
1.  Open your browser and go to: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2.  The download should start automatically. If not, click the link for "64-bit Git for Windows Setup".

**Step 2: Install Git**
1.  Run the downloaded `.exe` file.
2.  **Important:** Keep all default settings. Just click **Next → Next → Next → Install → Finish**.
3.  Do not change any options unless you know what you're doing.

**Step 3: Verify Installation**
1.  Open **Command Prompt** (search for "cmd" in Start Menu) or **PowerShell**.
2.  Type: `git --version`
3.  Press Enter.
4.  ✅ If you see a version number: **Success!**

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "git: command not found" (after installation) | Restart your Terminal/Command Prompt. If it still doesn't work, restart your computer. |
| "Permission denied" errors | On Mac: Try running with `sudo`. On Windows: Run Command Prompt as Administrator. |
| The Agent says "git is not installed" | Double-check the installation steps above. Make sure you installed Git, not GitHub Desktop (they are different). |

---

## 🎓 Summary

| Term | Meaning |
|------|---------|
| **Git** | A system that tracks changes to your files over time. |
| **Repository** | A folder tracked by Git. |
| **Commit** | A saved snapshot of your project. |
| **Commit Message** | A short description of what changed. |
| **History** | The list of all Commits (your project's timeline). |

**Your role:** Install Git, then let the AI do the rest.
**The AI's role:** Create Commits after each Sprint so your progress is safely saved.

---

## 📚 Want to learn more? (Optional)

If you're curious about Git beyond this course, here are some beginner-friendly resources:

*   [Git - The Simple Guide](https://rogerdudler.github.io/git-guide/) (10 min read)
*   [GitHub: Git Handbook](https://guides.github.com/introduction/git-handbook/) (Official Guide)
*   [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials/what-is-version-control) (Detailed)

But for this project, you don't need any of that. Just install Git and let the Sprinter Agent handle the rest!
