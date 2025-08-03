import { ReleaseBot } from './bot';
import dotenv from 'dotenv';

dotenv.config();

const bot = new ReleaseBot(process.env.GITHUB_TOKEN!);

async function main() {
    try {
        // Example usage
        const owner = 'your-github-username';
        const repo = 'your-repo-name';
        const artifactId = `release-${Date.now()}`;

        const status = await bot.triggerReleasePipeline(owner, repo, artifactId);
        console.log(`Pipeline Status: ${status}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
