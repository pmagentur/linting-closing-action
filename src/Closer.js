const core = require('@actions/core');
const github = require('@actions/github');

module.exports = class Closer {
    constructor() {
        this.githubToken = core.getInput('github-token');
        this.octokit = github.getOctokit(this.githubToken);
    }

    async closePullRequest(number, owner, repo, message = null) {
        if (message) {
            this._addCommentToPullRequest(number, owner, repo, message)
                .catch((error) => core.error('Failed to add comment to pull request: ' + error.message));
        }

        await this.octokit.rest.pulls.update({
            owner,
            repo,
            pull_number: number,
            state: 'closed'
        });

        core.info(`Pull request #${number} has been closed`);
    }

    async _addCommentToPullRequest(number, owner, repo, message) {
        await this.octokit.rest.pulls.createComment({
            owner,
            repo,
            pull_number: number,
            body: message
        });
    }
}
