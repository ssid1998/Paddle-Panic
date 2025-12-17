---
description: Finish the current phase, check quality, and generate artifacts.
---
Execute the **Phase Completion Routine**.

**Step 1: Quality Gate Check (CRITICAL)**
Analyze our conversation and the gathered information.
*   **Is the information sufficient for a professional Scrum process?**
    *   *Visionary Phase:* Is the Vision clear? Are Epics defined? Is the first tangible result identified?
    *   *Architect Phase:* Is the technical feasibility clear? Is the Roadmap token-safe?
    *   *Team Phase:* Are tasks clear enough to code?
*   **IF NO:** Stop immediately! Explain what is missing (e.g., "The Epics are too vague"). Ask me to provide more details. Do NOT generate files.
*   **IF YES:** Proceed to Step 2.

**Step 2: Artifact Generation (Only if YES)**
1.  **Read Templates:** Read the relevant templates from `agile/templates/`.
2.  **Generate:** Create the final documents based on our chat and the templates.
    *   *Visionary:* `agile/artifacts/PROJECT_VISION.md`, `agile/artifacts/PRODUCT_BACKLOG.md`
    *   *Architect:* `agile/artifacts/ROADMAP.md`, `agile/artifacts/DEFINITION_OF_DONE.md`
    *   *Team:* `agile/pipeline/02_sprint/SPRINT_BACKLOG.md`
    *   *QA:* `agile/pipeline/03_review/QA_REPORT.md`
3.  **Verify:** List the created files using `ls -l` to confirm success.
4.  **Handover:** Inform me that the phase is complete and which agent takes over next.