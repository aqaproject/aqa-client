import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
	overwrite: true,
	schema: `${process.env.GRAPHQL_API_URL}` || "",
	documents: "src/**/*.graphql",
	// ignoreNoDocuments: true,
	generates: {
		"src/gql/graphql.ts": {
			// preset: "client",
			plugins: [
				"typescript",
				"typescript-operations",
				"typescript-react-apollo",
			],
			config: {
				withHooks: true,
				withRefetchFn: true,
				withMutationFn: true,
			},
		},
	},
};

export default config;
