const { Octokit } = require('@octokit/rest');

class ReleaseBot {
    constructor(githubToken) {
        this.octokit = new Octokit({ auth: githubToken });
    }

    async triggerReleasePipeline(owner, repo, artifactId) {
        try {
            // First check if the workflow file exists
            try {
                await this.octokit.actions.getWorkflow({
                    owner,
                    repo,
                    workflow_id: 'release.yml'
                });
            } catch (error) {
                if (error.status === 404) {
                    throw new Error('Workflow file release.yml not found in repository. Please create it first.');
                }
                throw error;
            }

            await this.octokit.actions.createWorkflowDispatch({
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
            if (error.status === 404) {
                throw new Error(`Repository not found or insufficient permissions. Please check your GitHub token and repository details (${owner}/${repo})`);
            }
            throw new Error(`Failed to trigger pipeline: ${error.message}`);
        }
    }

    async checkPipelineStatus(owner, repo, runId) {
        const { data } = await this.octokit.actions.getWorkflowRun({
            owner,
            repo,
            run_id: runId
        });
        return data.status || 'unknown';
    }

    async retryFailedPipeline(owner, repo, runId) {
        await this.octokit.actions.reRunWorkflowFailedJobs({
            owner,
            repo,
            run_id: runId
        });
    }
}

module.exports = { ReleaseBot };
