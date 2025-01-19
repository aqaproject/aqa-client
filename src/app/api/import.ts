import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	const form = new formidable.IncomingForm();

	form.parse(req, (err, fields, files) => {
		if (err) {
			console.error("Error parsing the file:", err);
			return res.status(500).json({ message: "File upload failed" });
		}

		const uploadedFiles = files.file;

		if (!uploadedFiles) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const filesArray = Array.isArray(uploadedFiles)
			? uploadedFiles
			: [uploadedFiles];

		try {
			filesArray.forEach((file) => {
				const tempPath = file.filepath;
				const targetPath = path.join(
					process.cwd(),
					"assets/uploads",
					file.originalFilename || "unknown_file"
				);

				fs.mkdirSync(path.dirname(targetPath), { recursive: true });

				fs.renameSync(tempPath, targetPath);
			});

			res.status(200).json({ message: "Files uploaded successfully" });
		} catch (error) {
			console.error("Error saving the files:", error);
			res.status(500).json({ message: "Failed to save the files" });
		}
	});
}
