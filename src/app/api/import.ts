import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
	api: {
		bodyParser: false, // Tắt bodyParser để sử dụng formidable
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

		// Kiểm tra và xử lý nếu files.file là một mảng hoặc undefined
		const uploadedFiles = files.file;

		// Nếu không có file nào được upload
		if (!uploadedFiles) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		// Đảm bảo uploadedFiles là một mảng
		const filesArray = Array.isArray(uploadedFiles)
			? uploadedFiles
			: [uploadedFiles];

		// Xử lý từng file trong mảng
		try {
			filesArray.forEach((file) => {
				const tempPath = file.filepath;
				const targetPath = path.join(
					process.cwd(),
					"assets/uploads",
					file.originalFilename || "unknown_file"
				);

				// Đảm bảo thư mục tồn tại
				fs.mkdirSync(path.dirname(targetPath), { recursive: true });

				// Di chuyển file đến thư mục đích
				fs.renameSync(tempPath, targetPath);
			});

			res.status(200).json({ message: "Files uploaded successfully" });
		} catch (error) {
			console.error("Error saving the files:", error);
			res.status(500).json({ message: "Failed to save the files" });
		}
	});
}
