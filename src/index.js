const { ReleaseBot } = require('./bot');
const dotenv = require('dotenv');

dotenv.config();

const bot = new ReleaseBot(process.env.GITHUB_TOKEN);

async function main() {
    const [operation = 'trigger'] = process.argv.slice(2);
    const owner = process.env.GITHUB_OWNER || 'your-github-username';
    const repo = process.env.GITHUB_REPO || 'your-repo-name';

    try {
        switch (operation) {
            case 'trigger':
                const artifactId = `release-${Date.now()}`;
                console.log(`Triggering release pipeline with artifact ID: ${artifactId}`);
                const status = await bot.triggerReleasePipeline(owner, repo, artifactId);
                console.log(`Pipeline Status: ${status}`);
                break;

            case 'status':
                const runId = parseInt(process.argv[3] || '0');
                if (!runId) {
                    throw new Error('Please provide a valid run ID');
                }
                const pipelineStatus = await bot.checkPipelineStatus(owner, repo, runId);
                console.log(`Pipeline Run ${runId} Status: ${pipelineStatus}`);
                break;

            case 'retry':
                const retryRunId = parseInt(process.argv[3] || '0');
                if (!retryRunId) {
                    throw new Error('Please provide a valid run ID');
                }
                await bot.retryFailedPipeline(owner, repo, retryRunId);
                console.log(`Retrying pipeline run ${retryRunId}`);
                break;

            default:
                console.log('Available commands: trigger, status <runId>, retry <runId>');
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
