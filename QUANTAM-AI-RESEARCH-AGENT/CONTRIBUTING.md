# Contributing Guidelines

Welcome, Capgemini Buildathon Team! This document guides you through our git workflow, coding standards, and project setup to ensure smooth, parallel development.

---

## 🚀 Git Collaboration Cheat Sheet

Follow these standard commands to set up, develop, and merge your work.

### 1. Clone the Repository
Start by cloning the repository to your local machine and navigate into the project directory:
```bash
git clone https://github.com/AbhiTrivedi2712/QUANTAM-AI-RESEARCH-AGENT.git
cd QUANTAM-AI-RESEARCH-AGENT
```

### 2. Configure Your Git Identity (First Time Only)
Ensure your commits are properly attributed:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@capgemini.com"
```

### 3. Fetch all Remote Branches & Switch to Your Branch
Ensure you have the latest state from remote, and check out your designated branch:
```bash
# Fetch latest branch metadata from GitHub
git fetch origin

# Switch to your assigned feature branch
git checkout <your-branch-name>
```
*Example (for Abhinav):*
```bash
git checkout frontend-ui
```

### 4. Daily Development Loop
Before you begin editing code each day, pull the latest changes from your branch to avoid divergence:
```bash
git pull origin <your-branch-name>
```

If there are changes on the stable `main` branch that you need to pull into your feature branch:
```bash
git checkout <your-branch-name>
# Fetch latest main
git fetch origin
# Merge main into your feature branch
git merge origin/main
```

### 5. Staging and Committing Changes
When you have completed a logically distinct set of changes:
```bash
# Check modified files
git status

# Stage specific files (recommended)
git add path/to/file.py

# Or stage all changes
git add .

# Commit with a descriptive message using Capgemini prefixes
git commit -m "feat(technical-agent): added RSI indicator calculations"
```

### 6. Pushing Changes to GitHub
Push your commits to the remote branch on GitHub:
```bash
git push origin <your-branch-name>
```

### 7. Submitting a Pull Request (PR)
When your feature or task is fully tested and ready to merge into `main`:
1. Go to the GitHub repository: https://github.com/AbhiTrivedi2712/QUANTAM-AI-RESEARCH-AGENT
2. Click on the **Pull Requests** tab.
3. Click the green **New Pull Request** button.
4. Set **base: `main`** and **compare: `<your-assigned-branch>`**.
5. Fill out the PR template, link the issue or task, and assign at least one team member as a **reviewer**.
6. Do **NOT** merge the PR yourself. Wait for approval and check if automated builds pass.

---

## 🛠️ Branch Assignment Matrix

| Owner | Assigned Branch | Primary Responsibility |
|:---|:---|:---|
| **Abhinav** | `frontend-ui` | React frontend, UI layout, components & charting widgets |
| **Priyansh** | `backend-data` | FastAPI server routes, caching, stock services & mock data |
| **Ummehani** | `technical-agent` | Technical Analysis Agent (RSI, MACD, SMA, EMA calculations) |
| **Suhani** | `fundamental-sentiment` | Fundamental Analysis Agent & News/Social Sentiment Agent |
| **Vedant** | `architecture-docs` | Diagrams, technical documentation, API specs, schemas |

---

## 📝 Coding Guidelines & Best Practices

1. **Keep the `main` Branch Stable**: Never push code directly to `main`. All additions must go through a pull request from your feature branch.
2. **Review Policy**: At least **one peer review** is required before a Pull Request is merged.
3. **Commit Messages**: Use semantic commit formatting:
   - `feat(...)`: for new features/code.
   - `fix(...)`: for bugs or corrections.
   - `docs(...)`: for readme, markdown changes.
   - `refactor(...)`: for rearranging code structures without changing behavior.
4. **Environment Variables**: Never commit API keys or credentials directly. Use `.env` files and add secrets to `.gitignore`.

For more details on the team's operational procedures, refer to [TEAM_WORKFLOW.md](file:///c:/Users/DELL/OneDrive/Desktop/Stock%20research%20Agent/TEAM_WORKFLOW.md).
