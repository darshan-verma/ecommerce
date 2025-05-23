"use client";
import Login from "@/components/admin-panel/Login";
import Loader from "@/components/admin-panel/Loader";
import { useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/admin-panel/Sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const isLoading = useAppSelector((state) => state.loadingReducer);
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	console.log("Session status:", status);
	console.log("Session data:", session);

	if (status === "loading") {
		return (
			<div className="bg-white h-screen flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (status === "unauthenticated" || !session?.user) {
		console.log("No valid session, redirecting to login");
		return <Login />;
	}

	if (!isClient) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex min-h-screen bg-gray-100">
			<Sidebar />
			<div className="flex-1 flex flex-col overflow-hidden md:ml-64">
				{/* <Navbar /> */}
				<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
					<div className="container mx-auto px-4 py-6">
						<ToastProvider>
							{children}
							{isLoading && <Loader />}
						</ToastProvider>
					</div>
				</main>
			</div>
		</div>
	);
}
