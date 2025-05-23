"use client";

import React from "react";
import {
	MdDashboard,
	MdManageAccounts,
	MdCategory,
	MdOutlineInventory2,
	MdMenu,
	MdChevronLeft,
	MdChevronRight,
} from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { IoAnalytics, IoSettings, IoLogOutOutline } from "react-icons/io5";
import { RiShoppingCartLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";
import { Button } from "@/components/ui/button";

const menus = [
	{
		title: "Analytics",
		icon: <IoAnalytics className="w-5 h-5" />,
		href: "/admin/analytics",
	},
	{
		title: "Products",
		icon: <RiShoppingCartLine className="w-5 h-5" />,
		href: "/admin/products",
	},
	{
		title: "Categories",
		icon: <MdCategory className="w-5 h-5" />,
		href: "/admin/categories",
	},
	{
		title: "Inventory",
		icon: <MdOutlineInventory2 className="w-5 h-5" />,
		href: "/admin/inventory",
	},
	{
		title: "Orders",
		icon: <GrTransaction className="w-5 h-5" />,
		href: "/admin/orders",
	},
	{
		title: "Customers",
		icon: <FiUsers className="w-5 h-5" />,
		href: "/admin/customers",
	},
];

const settingsMenu = [
	{
		title: "Settings",
		icon: <IoSettings className="w-5 h-5" />,
		href: "/admin/settings",
	},
];

const Sidebar = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { isCollapsed, toggleSidebar } = useSidebar();

	const handleSignOut = async () => {
		try {
			await signOut({
				redirect: true,
				callbackUrl: "/admin/analytics",
			});
		} catch (error) {
			console.error("Error during sign out:", error);
			window.location.href = "/admin/analytics";
		}
	};

	return (
		<>
			{/* Mobile sidebar toggle */}
			<div className="md:hidden fixed top-4 left-4 z-50">
				<Button
					variant="outline"
					size="icon"
					onClick={toggleSidebar}
					className="bg-white"
				>
					<MdMenu className="h-5 w-5" />
				</Button>
			</div>

			{/* Overlay for mobile */}
			<div
				className={cn(
					"fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
					isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
				)}
				onClick={toggleSidebar}
			/>

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed top-0 left-0 h-screen bg-white border-r dark:bg-gray-900 dark:border-gray-700 z-50",
					"transition-all duration-300 ease-in-out overflow-hidden",
					isCollapsed ? "w-20" : "w-64"
				)}
			>
				<div className="flex flex-col h-full">
					{/* Logo and Toggle */}
					<div className="flex items-center justify-between p-4 border-b">
						{!isCollapsed && (
							<div className="flex items-center gap-3">
								<img
									className="w-10 h-10 rounded-lg"
									src="/favicon.ico"
									alt="logo"
								/>
								<h2 className="text-xl font-semibold text-gray-800 dark:text-white">
									Admin
								</h2>
							</div>
						)}
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleSidebar}
							className="ml-auto"
						>
							{isCollapsed ? (
								<MdChevronRight className="h-5 w-5" />
							) : (
								<MdChevronLeft className="h-5 w-5" />
							)}
							<span className="sr-only">Toggle sidebar</span>
						</Button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 overflow-y-auto py-4">
						<div className="space-y-1 px-2">
							{menus.map((item, idx) => {
								const isActive = pathname === item.href;
								return (
									<Link
										key={idx}
										href={item.href}
										className={cn(
											"flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
											isActive
												? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
												: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
										)}
									>
										<span className="flex-shrink-0">{item.icon}</span>
										{!isCollapsed && <span className="ml-3">{item.title}</span>}
									</Link>
								);
							})}
						</div>

						<div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 px-2">
							<div className="space-y-1">
								{settingsMenu.map((item, idx) => {
									const isActive = pathname === item.href;
									return (
										<Link
											key={`settings-${idx}`}
											href={item.href}
											className={cn(
												"flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
												isActive
													? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
													: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
											)}
										>
											<span className="flex-shrink-0">{item.icon}</span>
											{!isCollapsed && (
												<span className="ml-3">{item.title}</span>
											)}
										</Link>
									);
								})}
							</div>
						</div>
					</nav>

					{/* Bottom section */}
					<div className="p-4 border-t border-gray-200 dark:border-gray-700">
						<button
							onClick={handleSignOut}
							className={cn(
								"flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md transition-colors",
								"hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20",
								isCollapsed ? "justify-center" : ""
							)}
						>
							<IoLogOutOutline className="h-5 w-5 flex-shrink-0" />
							{!isCollapsed && <span className="ml-3">Logout</span>}
						</button>
					</div>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
