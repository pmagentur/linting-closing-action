const github = require('@actions/github');
const core = require('@actions/core');

import Closer from "./Closer";

async function main() {
    const closer = new Closer();

    if (!github.context.eventName.toLowerCase().includes('pull_request')) {
        core.info('This action only works on pull requests');
        return;
    }

    const pullRequest = github.context.payload.pull_request
    await closer.closePullRequest(pullRequest.number, github.context.repo.owner, github.context.repo.repo);
}

main().catch((error) => core.setFailed(error.message));
