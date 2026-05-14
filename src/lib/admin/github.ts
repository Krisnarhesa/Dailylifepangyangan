import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_REPO_OWNER || 'Krisnarhesa';
const repo = process.env.GITHUB_REPO_NAME || 'Dailylifepangyangan';
const branch = process.env.GITHUB_BRANCH || 'main';

export interface PendingChange {
  type: 'add' | 'update' | 'delete';
  path: string;
  content?: string;
  encoding?: 'utf-8' | 'base64';
}

export class GitHubService {
  private pendingChanges: PendingChange[] = [];

  addChange(change: PendingChange) {
    const existingIndex = this.pendingChanges.findIndex(c => c.path === change.path);
    if (existingIndex >= 0) {
      this.pendingChanges[existingIndex] = change;
    } else {
      this.pendingChanges.push(change);
    }
  }

  getPendingChanges(): PendingChange[] {
    return [...this.pendingChanges];
  }

  clearPendingChanges() {
    this.pendingChanges = [];
  }

  async commitAndPush(commitMessage: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.pendingChanges.length === 0) {
        return { success: false, error: 'No pending changes to commit' };
      }

      const { data: refData } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      });

      const currentCommitSha = refData.object.sha;

      const { data: commitData } = await octokit.rest.git.getCommit({
        owner,
        repo,
        commit_sha: currentCommitSha,
      });

      const baseTreeSha = commitData.tree.sha;

      const tree = await Promise.all(
        this.pendingChanges.map(async (change) => {
          if (change.type === 'delete') {
            return {
              path: change.path,
              mode: '100644' as const,
              type: 'blob' as const,
              sha: null,
            };
          }

          const { data: blob } = await octokit.rest.git.createBlob({
            owner,
            repo,
            content: change.content || '',
            encoding: change.encoding || 'utf-8',
          });

          return {
            path: change.path,
            mode: '100644' as const,
            type: 'blob' as const,
            sha: blob.sha,
          };
        })
      );

      const { data: newTree } = await octokit.rest.git.createTree({
        owner,
        repo,
        base_tree: baseTreeSha,
        tree,
      });

      const { data: newCommit } = await octokit.rest.git.createCommit({
        owner,
        repo,
        message: commitMessage,
        tree: newTree.sha,
        parents: [currentCommitSha],
      });

      await octokit.rest.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: newCommit.sha,
      });

      this.clearPendingChanges();

      return { success: true };
    } catch (error: any) {
      console.error('GitHub commit error:', error);
      return { success: false, error: error.message };
    }
  }
}

export const githubService = new GitHubService();
