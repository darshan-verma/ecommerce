"use client";
import Login from "@/components/admin-panel/Login";
import Loader from "@/components/admin-panel/Loader";
import { useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/admin-panel/Sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";

// Create a separate component for the authenticated layout
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
	const { isCollapsed } = useSidebar();
	const isLoading = useAppSelector((state) => state.loadingReducer);

	return (
		<div className="flex min-h-screen bg-gray-100">
			<Sidebar />
			<div
				className={cn(
					"flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
					isCollapsed ? "md:ml-20" : "md:ml-64"
				)}
			>
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

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
		<SidebarProvider>
			<AuthenticatedLayout>{children}</AuthenticatedLayout>
		</SidebarProvider>
	);
}
