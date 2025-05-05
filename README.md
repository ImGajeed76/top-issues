# Feature Rank Action ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Optional: Add a license badge -->
[![Uses GitHub Actions](https://img.shields.io/badge/Uses-GitHub%20Actions-blue?logo=githubactions&logoColor=white)](https://github.com/features/actions) <!-- Optional: Actions badge -->

A simple GitHub Action that automatically ranks open feature request issues in your repository based on 👍 reactions and
generates a Markdown file listing them.

---

## 🤔 What it Does

This action runs on a schedule (or manually) to:

1. Find all **open** issues in your repository with a specific label (e.g., `feature-request`).
2. Count the number of 👍 (thumbs up) reactions on each of those issues.
3. Sort the issues in descending order based on the reaction count.
4. Generate (or update) a Markdown file (e.g., `RANKED_FEATURES.md`) in your repository listing the ranked issues with
   links.

## 🎉 Why Use It?

* **Automated Prioritization:** Get a quick, data-driven overview of what features your community is most interested in.
* **Improved Visibility:** Provides an easy-to-read list for maintainers and contributors.
* **Simple Setup:** Just add two files to your repository.
* **Free & Integrated:** Runs directly within GitHub using GitHub Actions (free for public repos).
* **No External Services:** Keeps everything within your GitHub repository.

## 📊 Example Output

The action will generate a file (e.g., `RANKED_FEATURES.md`) that looks something like this:

➡️ [See EXAMPLE_RANKED_FEATURES.md](EXAMPLE_RANKED_FEATURES.md)


---

## 🚀 Installation & Setup

Setting this up in your repository is easy:

1. **Create Workflow Directory:**
   If it doesn't exist, create the `.github/workflows` directory in the root of your repository.

2. **Copy Workflow File:**
   Copy the contents of [`.github/workflows/rank-features.yml`](./.github/workflows/rank-features.yml) from *this*
   repository into a new file named `rank-features.yml` inside *your* repository's `.github/workflows/` directory.

3. **Create Scripts Directory:**
   If it doesn't exist, create the `.github/scripts` directory in the root of your repository.

4. **Copy Script File:**
   Copy the contents of [`.github/scripts/rank_issues.ts`](./.github/scripts/rank_issues.ts) from *this* repository into
   a new file named `rank_issues.ts` inside *your* repository's `.github/scripts/` directory.

5. **Customize (Optional):**
   Open *your* `.github/workflows/rank-features.yml` file and adjust the following settings if needed:

* **Schedule:** Change the `cron` schedule under `on:` to run more or less frequently (
  see [Cron Schedule Syntax](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)).
  Default is daily at midnight UTC.
* **Label:** Change the `FEATURE_LABEL` environment variable under `env:` if you use a different label for feature
  requests (e.g., `enhancement`).
* **Output File:** Change the `OUTPUT_FILE` environment variable if you want to name the generated Markdown file
  differently or place it elsewhere.
* **Commit Branch:** By default, the action commits to your repository's default branch. If you want to commit to a
  different branch (like `gh-pages`), add a `COMMIT_BRANCH` environment variable under `env:`.
* **Commit Message:** Change the `COMMIT_MESSAGE` environment variable for a custom commit message.

6. **Commit & Push:**
   Commit these two new files (`.github/workflows/rank-features.yml` and `.github/scripts/rank_issues.ts`) to your
   repository.

That's it! The action will run on the next scheduled time or you can trigger it manually from the "Actions" tab in your
repository (look for "Rank Feature Requests").

---

## ⚙️ Configuration Options (in `rank-features.yml`)

You can customize the action's behavior by modifying the `env:` section within your
`.github/workflows/rank-features.yml` file:

* `FEATURE_LABEL`: (Required) The label used to identify feature request issues.
* Default: `feature-request`
* `OUTPUT_FILE`: (Required) The path (relative to the repo root) where the Markdown report will be saved.
* Default: `RANKED_FEATURES.md`
* `COMMIT_MESSAGE`: (Optional) The commit message used when updating the report file.
* Default: `Update ranked features list`
* `COMMIT_BRANCH`: (Optional) The branch to commit the report file to. If not set, uses the repository's default branch.
* Example: `gh-pages`

---

## 🙏 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request to improve this action.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
