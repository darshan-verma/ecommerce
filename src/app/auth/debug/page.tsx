"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthDebugPage() {
	const { data: session, status } = useSession();

	useEffect(() => {
		console.log("Session:", session);
		console.log("Status:", status);
		console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
		console.log("NODE_ENV:", process.env.NODE_ENV);
	}, [session, status]);

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-2xl font-bold mb-6">Auth Debug</h1>

			<div className="bg-white p-6 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold mb-4">Session Status</h2>
				<pre className="bg-gray-100 p-4 rounded overflow-auto">
					{JSON.stringify({ status, session }, null, 2)}
				</pre>
			</div>

			<div className="mt-6 bg-white p-6 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
				<div className="space-y-2">
					<p>
						<span className="font-medium">NODE_ENV:</span>{" "}
						{process.env.NODE_ENV}
					</p>
					<p>
						<span className="font-medium">NEXTAUTH_URL:</span>{" "}
						{process.env.NEXTAUTH_URL || "Not set"}
					</p>
					<p>
						<span className="font-medium">GOOGLE_CLIENT_ID:</span>{" "}
						{process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set"}
					</p>
					<p>
						<span className="font-medium">NEXTAUTH_SECRET:</span>{" "}
						{process.env.NEXTAUTH_SECRET ? "Set" : "Not set"}
					</p>
				</div>
			</div>

			<div className="mt-6 bg-white p-6 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold mb-4">Next Steps</h2>
				<ol className="list-decimal pl-6 space-y-2">
					<li>Check your browser's console for more detailed logs</li>
					<li>
						Verify your{" "}
						<code className="bg-gray-100 px-1 rounded">.env.local</code> file
						exists in your project root
					</li>
					<li>
						Ensure Google OAuth credentials are properly configured in Google
						Cloud Console
					</li>
					<li>
						Check that the redirect URIs in Google Cloud Console match your
						app's URLs
					</li>
				</ol>
			</div>
		</div>
	);
}
