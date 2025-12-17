# Agile AI Framework - User Guide

This directory (`agile/`) contains a complete framework for **AI-Assisted Scrum**. It separates the "Truth" (Project State) from the "Flow" (Active Work) and uses specialized AI Agents to guide you through the software development lifecycle.

## 🚀 Quick Start

1.  **Phase 0: Inception**
    *   Use Agent: **`@visionary`**
    *   Command: `/visionary-start-interview`
    *   Goal: Create Vision & Backlog.

2.  **Phase 1: Architecture**
    *   Use Agent: **`@architect`**
    *   Command: `/architect-start-analysis`
    *   Goal: Create a technical Roadmap & Slicing.

3.  **Phase 2: Sprint Cycle**
    *   Use Agent: **`@team`**
    *   Command: `/team-start-planning` (then execution)
    *   Goal: Write Code & Tests.

4.  **Phase 3: Review**
    *   Use Agent: **`@qa`**
    *   Command: `/qa-start-review`
    *   Goal: Quality Gate (Pass/Fail).

5.  **Phase 4: Release**
    *   Use Agent: **`@archivist`**
    *   Command: `/archivist-archive-sprint`
    *   Goal: Git Commit & Archive.

---

## 📂 Directory Structure

### `artifacts/` (The Truth)
Contains the living documents of the project.
*   `PROJECT_VISION.md`: The "North Star".
*   `PRODUCT_BACKLOG.md`: The prioritized list of features.
*   `ROADMAP.md`: The plan, optimized for Context Windows.

### `pipeline/` (The Flow)
The workspaces for the agents.
*   `00_inception`: Drafts for Vision.
*   `01_architecture`: Analysis logs.
*   `02_sprint`: **Active Sprint Backlog**.
*   `03_review`: QA Reports.
*   `04_release`: Staging area.

### `archive/` (The Memory)
Completed sprints are moved here by the Archivist.

### `agents/` (The Tools)
Source definitions for the AI Agents. Copy these to your `.opencode/agents/` folder.
Slash Commands are located in `agents/commands/`. Copy these to your `.opencode/command/` folder.

---

## ⚠️ Important Rules

1.  **Installation:**
    To use this framework, you must install the agents and commands into your OpenCode configuration:
    ```bash
    mkdir -p .opencode/agents .opencode/command
    cp agile/agents/*.md .opencode/agents/
    cp agile/agents/commands/*.md .opencode/command/
    ```
2.  **Bash Required:** This framework relies on Bash commands. Windows users should use **Git Bash** or **WSL**.
3.  **No Commits:** Only the **Archivist** is allowed to run `git commit`. All other agents only modify files.
4.  **Context Window:** The Architect slices Sprints specifically so they fit into the AI's context window. Respect the Roadmap!
