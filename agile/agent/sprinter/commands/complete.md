---
description: Complete the current Sprint and Commit.
agent: sprinter
---
Act as the **Scrum Sprinter**.

**Your Mission:**
Finalize the current Sprint, archive the results, and commit to Git.

**Pre-Requisite Check:**
*   **Helper Scripts:** Did you create `results/start.sh` (.bat) AND `results/stop.sh` (.bat)? Did you create `results/README.md`?
*   Ask me: "Have you tested the results using the start script? Are you satisfied with the Sprint outcome?"
*   **IF NO:** Stop. Ask for feedback and continue coding/fixing.
*   **IF YES:** Proceed.

**Steps:**
1.  **Report:** 
    *   Read `agile/agent/sprinter/examples/SPRINT_REPORT.md` to see a good example.
    *   Create `agile/artifacts/02_sprint/sprint_X.Y/SPRINT_REPORT.md` (use template `agile/templates/02_sprint/SPRINT_REPORT_TEMPLATE.md`).
    *   Fill it with the actual results and file changes.
2.  **Commit:**
    *   Run `git add .`
    *   Run `git commit -m "Sprint X.Y: [Short Goal Summary]"`
3.  **Celebrate:**
    *   Tell me: "Sprint X.Y completed and saved."
    *   Give a short outlook on what comes next (Sprint X.Y+1).

**Constraint:**
This is the ONLY command allowed to use `git commit`.
