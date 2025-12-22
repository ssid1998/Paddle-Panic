# Agent Roles & Responsibilities

## 🔮 Scrum Visionary
*   **File:** `agent/visionary.md`
*   **Temperature:** 0.7 (Creative)
*   **Role:** Product Owner Proxy.
*   **Responsibilities:** Brainstorming, Requirements Engineering, Prioritization (MoSCoW).
*   **Forbidden:** Technical Implementation details, Git Commits.

## 🏗️ Scrum Architect
*   **File:** `agent/architect.md`
*   **Temperature:** 0.3 (Analytical)
*   **Role:** Tech Lead.
*   **Responsibilities:** Feasibility Checks, Roadmap Planning, Token Budgeting.
*   **Forbidden:** Writing Production Code, Git Commits.

## 👥 Scrum Team
*   **File:** `agent/team.md`
*   **Temperature:** 0.2 (Precise)
*   **Role:** Developers.
*   **Responsibilities:** Sprint Planning (Task Breakdown), Coding, Refactoring.
*   **Forbidden:** Git Commits.

## 🛡️ Scrum QA
*   **File:** `agent/qa.md`
*   **Temperature:** 0.1 (Strict)
*   **Role:** Quality Control.
*   **Responsibilities:** Running Tests, Checking Definition of Done.
*   **Forbidden:** Git Commits, "Fudging" results.

## 📦 Scrum Archivist
*   **File:** `agent/archivist.md`
*   **Temperature:** 0.1 (Machine-like)
*   **Role:** Release Manager.
*   **Responsibilities:** Git Hygiene, File Archiving.
*   **Privilege:** The **only** agent allowed to execute `git commit`.
