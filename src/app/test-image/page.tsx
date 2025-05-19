"use client";

import { useEffect, useState } from "react";

export default function TestImagePage() {
	const [imageData, setImageData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const testImageLoading = async () => {
			try {
				setLoading(true);
				// First, get the list of uploaded images
				const res = await fetch("/api/test-image");
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Failed to fetch image data");
				}

				setImageData(data);
				setError(null);
			} catch (err) {
				console.error("Test image error:", err);
				setError(err instanceof Error ? err.message : "Unknown error occurred");
			} finally {
				setLoading(false);
			}
		};

		testImageLoading();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading test data...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-2xl">
					<div className="flex">
						<div className="flex-shrink-0">
							<svg
								className="h-5 w-5 text-red-400"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-red-800">
								Error loading test data
							</h3>
							<div className="mt-2 text-sm text-red-700">
								<p>{error}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-12 px-4">
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<h1 className="text-2xl font-semibold text-gray-900">
						Image Loading Test
					</h1>
					<p className="mt-1 text-sm text-gray-500">
						This page tests if images are being served correctly from the
						uploads directory.
					</p>
				</div>

				<div className="px-6 py-4">
					<h2 className="text-lg font-medium text-gray-900 mb-4">
						Server Information
					</h2>
					<div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
						<pre className="text-sm text-gray-800">
							{JSON.stringify(
								{
									uploadsPath: imageData?.uploadsPath,
									publicDir: imageData?.publicDir,
									cwd: imageData?.cwd,
								},
								null,
								2
							)}
						</pre>
					</div>

					<h2 className="text-lg font-medium text-gray-900 mt-8 mb-4">
						Uploaded Images
					</h2>

					{imageData?.files?.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{imageData.files.map((file: any) => (
								<div
									key={file.name}
									className="border rounded-lg overflow-hidden bg-white shadow-sm"
								>
									<div className="p-4">
										<h3 className="text-sm font-medium text-gray-900 truncate">
											{file.name}
										</h3>
										<p className="text-xs text-gray-500">
											{Math.round(file.size / 1024)} KB
										</p>
									</div>
									<div className="bg-gray-100 p-4 flex justify-center">
										<img
											src={file.url}
											alt={file.name}
											className="h-40 w-full object-contain bg-white p-2 border rounded"
											onError={(e) => {
												console.error("Failed to load image:", file.url);
												const target = e.target as HTMLImageElement;
												target.onerror = null;
												target.src = "/placeholder-category.png";
											}}
										/>
									</div>
									<div className="p-4 bg-gray-50">
										<p className="text-xs break-all text-gray-600">
											<span className="font-medium">Path:</span> {file.path}
										</p>
										<p className="text-xs break-all text-gray-600 mt-1">
											<span className="font-medium">URL:</span> {file.url}
										</p>
										<p className="text-xs mt-2">
											<span className="font-medium">Status:</span>{" "}
											<span
												className={
													file.exists ? "text-green-600" : "text-red-600"
												}
											>
												{file.exists ? "File exists" : "File not found"}
											</span>
										</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-yellow-400"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-yellow-700">
										No images found in the uploads directory.
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
