import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

export class ReleaseBot {
    private octokit: Octokit;
    
    constructor(private githubToken: string) {
        this.octokit = new Octokit({ auth: githubToken });
    }

    async triggerReleasePipeline(owner: string, repo: string, artifactId: string): Promise<string> {
        try {
            const workflow = await this.octokit.actions.createWorkflowDispatch({
                owner,
                repo,
                workflow_id: 'release.yml',
                ref: 'master',
                inputs: {
                    artifact_id: artifactId
                }
            });
            return 'Pipeline triggered successfully';
        } catch (error) {
            throw new Error(`Failed to trigger pipeline: ${error.message}`);
        }
    }

    async checkPipelineStatus(owner: string, repo: string, runId: number): Promise<string> {
        const { data } = await this.octokit.actions.getWorkflowRun({
            owner,
            repo,
            run_id: runId
        });
        return data.status ?? 'unknown';
    }

    async retryFailedPipeline(owner: string, repo: string, runId: number): Promise<void> {
        await this.octokit.actions.reRunWorkflowFailedJobs({
            owner,
            repo,
            run_id: runId
        });
    }
}
