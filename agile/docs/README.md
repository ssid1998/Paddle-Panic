# Agile AI Framework - User Guide

This directory (`agile/`) contains a complete framework for **AI-Assisted Scrum**. It separates the "Truth" (Project State) from the "Flow" (Active Work) and uses specialized AI Agents to guide you through the software development lifecycle.

## 🚀 Quick Start

1.  **Phase 0: Inception**
    *   Use Agent: **`@visionary`**
    *   Command: `/visionary-start`
    *   Goal: Create Vision & Backlog.

2.  **Phase 1: Architecture**
    *   Use Agent: **`@architect`**
    *   Command: `/architect-start`
    *   Goal: Create a technical Execution Plan (Roadmap).

3.  **Phase 2: Sprint Cycle**
    *   Use Agent: **`@sprinter`**
    *   Command: `/sprinter-start`
    *   Goal: Autonomously implement one Sprint at a time (Dev + Test + QA + Commit).

---

## 📂 Directory Structure

### `artifacts/` (The Truth)
Contains the living documents of the project.
*   `00_inception/`: Vision & Product Backlog.
*   `01_architecture/`: Technical Plan & Technology Glossary.
*   `02_sprint/`: Active Sprint Backlogs & Reports.

### `agent/` (The Tools)
Source definitions for the AI Agents. Copy these to your `.opencode/agent/` folder.
Slash Commands are located in `agent/commands/`. Copy these to your `.opencode/command/` folder.

### `templates/` (The Forms)
Markdown templates for the artifacts, organized by phase.

---

## ⚠️ Important Rules

1.  **Installation:**
    To use this framework, you must install the agents and commands into your OpenCode configuration (or use the pre-configured `.opencode` folder).
2.  **Bash Required:** This framework relies on Bash commands.
3.  **No Commits:** Only the **Sprinter** (via `/sprinter-complete`) is allowed to run `git commit`. All other agents only modify files.
4.  **Context Window:** The Architect slices Sprints specifically so they fit into the AI's context window. Respect the Roadmap!
