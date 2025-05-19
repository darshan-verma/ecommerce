import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
	try {
		const uploadsPath = path.join(
			process.cwd(),
			"public",
			"uploads",
			"categories"
		);

		// Check if directory exists
		if (!fs.existsSync(uploadsPath)) {
			return NextResponse.json(
				{
					success: false,
					error: "Uploads directory does not exist",
					path: uploadsPath,
					cwd: process.cwd(),
				},
				{ status: 404 }
			);
		}

		// Read directory contents
		const files = fs.readdirSync(uploadsPath);

		// Get file stats
		const fileDetails = files.map((file) => ({
			name: file,
			path: path.join(uploadsPath, file),
			url: `/uploads/categories/${file}`,
			exists: fs.existsSync(path.join(uploadsPath, file)),
			size: fs.statSync(path.join(uploadsPath, file)).size,
		}));

		return NextResponse.json({
			success: true,
			files: fileDetails,
			uploadsPath,
			cwd: process.cwd(),
			publicDir: path.join(process.cwd(), "public"),
		});
	} catch (error) {
		console.error("Error in test-image endpoint:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				stack: error instanceof Error ? error.stack : undefined,
			},
			{ status: 500 }
		);
	}
}
