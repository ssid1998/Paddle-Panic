### Moodle Announcement: Simulation Game Update (Phase 2 - The Final Sprint)

**Subject:** Update: Phase 2 (Implementation) - The Finish Line

Dear Students,

We have reached the final and most exciting phase of our project! After defining the Vision (Phase 0) and the Architecture (Phase 1), it is now time to build the actual software.

**Update v3 (Phase 2)** is now available as `Simulation Game - Phase 2.zip`.

---

### 🚀 Phase 2: The Sprinter Agent

This is the final phase of the framework. Unlike traditional software development which often separates planning, coding, and review into different meetings, the **Sprinter Agent** combines all these aspects into a highly efficient, iterative loop powered by AI.

**The Process:**
The software will work through the **Execution Plan** you created in Phase 1, sprint by sprint, until a fully functional result exists.

1.  **Iterative Cycles:**
    You don't build everything at once. You build "Incremental Prototypes". Each sprint delivers a specific, working part of your application.

2.  **Consolidated Scrum:**
    To save time, we have merged the classic Scrum ceremonies (Planning, Review, Retrospective) into a continuous dialogue with the AI:
    *   **Planning:** At the start of each sprint (`/sprinter-start`), you and the agent explicitly define **what you will see** at the end. What is the testable outcome?
    *   **Execution:** The agent writes the code and sets up the environment autonomously.
    *   **Review:** You test the result using the generated helper scripts (`start.sh` / `start.bat`).
    *   **Completion:** Only when *you* verify that the software works as intended, you close the sprint (`/sprinter-complete`).

---

### 📝 How to Work in Phase 2

**1. Start a Sprint**
Type `/sprinter-start`. The agent will read your Roadmap and propose the goal for the current sprint.
*   **Crucial Step:** Agree on the **Acceptance Criteria**. Ask the agent: *"How will I be able to test this?"* BEFORE it starts coding.

**2. Test the Result**
The agent will create a `results/` folder with your code. It will also generate `start.sh` (Mac/Linux) and `start.bat` (Windows) scripts.
*   **Action:** Run the script and interact with your prototype. Does it work? Is it what you imagined?

**3. Loop & Feedback**
If something is broken or missing, **tell the agent**. It will fix the code immediately. Do not move to the next sprint until the current one is working.

**4. Complete & Commit**
Once you are happy with the prototype, type `/sprinter-complete`. This saves your progress (Git Commit) and prepares the next sprint from your Roadmap.

---

### ⚠️ Your Responsibility: Human in the Loop

While the AI is powerful, it is not perfect. You are the Project Manager, and you are in charge.

*   **Check the Order:** Always verify that the Sprint the agent proposes matches the order in your `PRODUCT_BACKLOG.md` (Execution Plan). If the agent skips a step or hallucinates a new feature, correct it immediately!
*   **Deviation:** Occasional deviations are normal, but they must be approved by you. Do not let the agent run wild.

### 📚 New Concept: Version Control (Git)

In this phase, we introduce **Git** to save your progress safely.
*   This topic hasn't been covered in lectures yet, but it is industry standard.
*   I have included a short guide **`GIT_GUIDE.md`** in the package. Please read it to understand how to install Git on your machine so the agent can do its job.

---

### 🛠️ How to Upgrade

1.  **Download** `Simulation Game - Phase 2.zip`.
2.  **Unzip** it into your project root (overwrite the existing `agile` folder).
3.  **Migrate:** Ensure your Phase 0 & 1 artifacts (`PROJECT_VISION.md`, `PRODUCT_BACKLOG.md`) are correctly placed in `agile/artifacts/00_inception` and `01_architecture`.
4.  **Start:** Open the chat and run `/sprinter-start` to begin implementation.

Enjoy seeing your ideas come to life!

Best regards,
[Your Name]
