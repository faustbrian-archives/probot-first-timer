import { getConfig } from "@botamic/toolkit";
import Joi from "@hapi/joi";
import { Context } from "probot";

export const loadConfig = async (context: Context): Promise<Record<string, any>> =>
	(await getConfig(
		context,
		"botamic.yml",
		Joi.object({
			firstTimer: Joi.object({
				issue: Joi.string().default("Thanks for opening your first issue here!"),
				mergedPullRequest: Joi.string().default("Congrats on merging your first pull request! "),
				pullRequest: Joi.string().default("Thanks for opening this pull request!"),
			}).default(),
		})
			.unknown(true)
			.default(),
	)).firstTimer;
