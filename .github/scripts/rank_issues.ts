// .github/scripts/rank_issues.ts

import {Octokit} from "@octokit/rest";
import fs from "fs/promises"; // Use promises API for async file operations
import path from "path";

// --- Configuration from Environment Variables ---
const githubToken = process.env.GITHUB_TOKEN;
const repoFullName = process.env.GITHUB_REPOSITORY; // Format: 'owner/repo'
const featureLabel = process.env.FEATURE_LABEL || "feature-request";
const outputFile = process.env.OUTPUT_FILE || "RANKED_FEATURES.md";

// --- Type Definitions ---
interface RankedIssue {
    id: number;
    number: number;
    title: string;
    url: string;
    reactionCount: number;
    author: string | null | undefined;
    createdAt: string;
}

interface GitHubIssue {
    id: number;
    number: number;
    title: string;
    html_url: string;
    state: string;
    labels: (
        | string
        | {
        name?: string | undefined;
        // other label properties if needed
    }
        )[];
    reactions?: {
        "+1"?: number;
        // include other reactions if needed
    };
    user?: {
        login: string;
    } | null;
    created_at: string;
    // Add other issue properties if needed
}

// --- Helper Functions ---
function getRepoOwnerAndName(repoFullName: string): { owner: string; repo: string } {
    const [owner, repo] = repoFullName.split("/");
    if (!owner || !repo) {
        throw new Error(
            `Invalid GITHUB_REPOSITORY format: ${repoFullName}. Expected 'owner/repo'.`,
        );
    }
    return {owner, repo};
}

function generateMarkdown(rankedIssues: RankedIssue[], repoFullName: string): string {
    const now = new Date().toISOString();
    let markdown = `### ✨ Top Feature Requests (${repoFullName})\n\n`;
    markdown += `*Updated: ${now}*\n\n`;

    if (rankedIssues.length === 0) {
        markdown += "_No open issues found with the specified label._\n";
        markdown += "\n---\n"; // Optional: Add a separator
        markdown += "_Generated with ❤️ by [Top Issues Action](https://github.com/ImGajeed76/top-issues)_";
        return markdown;
    }

    markdown += "| Rank | 👍 | Feature Request | Issue |\n";
    markdown += "| :--- | :-: | :-------------- | :---- |\n";

    rankedIssues.forEach((issue, index) => {
        const rank = index + 1;
        // Simple title escape: replace | with escaped pipe \|
        const escapedTitle = issue.title.replace(/\|/g, "\\|");
        const issueLink = `[${repoFullName}#${issue.number}](${issue.url})`;
        markdown += `| ${rank} | ${issue.reactionCount} | ${escapedTitle} | ${issueLink} |\n`;
    });

    markdown += "\n---\n"; // Optional: Add a separator
    markdown += "_Generated with ❤️ by [Top Issues Action](https://github.com/ImGajeed76/top-issues)_";

    return markdown;
}

// --- Main Script Logic ---
async function main() {
    console.log("Starting feature ranking process...");

    if (!githubToken) {
        throw new Error("GITHUB_TOKEN environment variable is not set.");
    }
    if (!repoFullName) {
        throw new Error("GITHUB_REPOSITORY environment variable is not set.");
    }

    const {owner, repo} = getRepoOwnerAndName(repoFullName);
    console.log(`Repository: ${owner}/${repo}`);
    console.log(`Feature Label: ${featureLabel}`);
    console.log(`Output File: ${outputFile}`);

    const octokit = new Octokit({auth: githubToken});

    console.log("Fetching open issues with label...");

    try {
        const issues: GitHubIssue[] = await octokit.paginate(
            "GET /repos/{owner}/{repo}/issues",
            {
                owner: owner,
                repo: repo,
                state: "open",
                labels: featureLabel,
                per_page: 100,
            },
        );

        console.log(`Found ${issues.length} open issues with the label.`);

        const rankedIssues: RankedIssue[] = issues
            .map((issue) => ({
                id: issue.id,
                number: issue.number,
                title: issue.title,
                url: issue.html_url,
                reactionCount: issue.reactions?.["+1"] || 0,
                author: issue.user?.login,
                createdAt: issue.created_at,
            }))
            .sort((a, b) => b.reactionCount - a.reactionCount); // Sort descending

        console.log("Generating Markdown content...");
        const markdownContent = generateMarkdown(rankedIssues, repoFullName);

        // Ensure the output directory exists
        const outputDir = path.dirname(outputFile);
        if (outputDir !== ".") {
            await fs.mkdir(outputDir, {recursive: true});
            console.log(`Ensured output directory exists: ${outputDir}`);
        }

        console.log(`Writing Markdown to ${outputFile}...`);
        await fs.writeFile(outputFile, markdownContent, "utf-8");

        console.log("✅ Successfully generated ranked features list!");
    } catch (error: any) {
        console.error("❌ Error during script execution:", error.message);
        // Log more details for debugging if available (e.g., API errors)
        if (error.status) {
            console.error("API Error Status:", error.status);
        }
        // Re-throw the error to make the GitHub Action step fail
        throw error;
    }
}

// Execute the main function
main().catch((error) => {
    // Ensure the process exits with a non-zero code on error
    process.exit(1);
});
