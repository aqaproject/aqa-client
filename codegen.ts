import type { CodegenConfig } from "@graphql-codegen/cli";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config: CodegenConfig = {
	overwrite: true,
	schema: process.env.NEXT_PUBLIC_API_URL_V2,
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
			// config: {
			// 	enumsAsTypes: true,
			// 	futureProofEnums: true,
			// },
		},
	},
};

export default config;
