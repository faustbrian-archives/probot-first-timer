import { Application, Context } from "probot";

const createComment = async (context: Context, key: string): Promise<void> => {
	try {
		const config = await context.config("botamic.yml");

		if (config && config.firstTimer && config.firstTimer[key]) {
			context.github.issues.createComment(
				context.issue({
					body: config.firstTimer[key],
				}),
			);
		}
	} catch (err) {
		if (err.code !== 404) {
			throw err;
		}
	}
};

export = (robot: Application) => {
	// First Issue
	robot.on("issues.opened", async (context: Context) => {
		const response = await context.github.issues.listForRepo(
			context.repo({
				creator: context.payload.issue.user.login,
				state: "all",
			}),
		);

		const totalCount: number = response.data.filter(data => !data.pull_request).length;
		if (totalCount === 1) {
			await createComment(context, "issue");
		}
	});

	// First Pull Request
	robot.on("pull_request.opened", async (context: Context) => {
		const response = await context.github.issues.listForRepo(
			context.repo({
				creator: context.payload.pull_request.user.login,
				state: "all",
			}),
		);

		const totalCount: number = response.data.filter(data => data.pull_request).length;
		if (totalCount === 1) {
			await createComment(context, "pullRequest");
		}
	});

	// First Merged Pull Request
	robot.on("pull_request.closed", async (context: Context) => {
		if (context.payload.pull_request.merged) {
			const author = context.payload.pull_request.user.login;
			const { owner, repo } = context.repo();
			const response = await context.github.search.issues({
				q: `is:pr is:merged author:${author} repo:${owner}/${repo}`,
			});

			const totalCount: number = response.data.items.filter(
				(pullRequest: any) => pullRequest.number !== context.payload.pull_request.number,
			).length;
			if (totalCount === 0) {
				await createComment(context, "mergedPullRequest");
			}
		}
	});
};
