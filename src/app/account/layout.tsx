import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/signin?callbackUrl=/account");
	}

	return (
		<div className="container py-8">
			<div className="flex flex-col md:flex-row gap-8">
				<aside className="w-full md:w-64 flex-shrink-0">
					<div className="space-y-1">
						<h2 className="text-lg font-semibold mb-4">My Account</h2>
						<nav className="space-y-1">
							<a
								href="/account"
								className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100"
							>
								Dashboard
							</a>
							<a
								href="/account/orders"
								className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
							>
								My Orders
							</a>
							<a
								href="/account/settings"
								className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
							>
								Account Settings
							</a>
							<a
								href="/account/addresses"
								className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
							>
								Address Book
							</a>
							<a
								href="/account/wishlist"
								className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
							>
								Wishlist
							</a>
						</nav>
					</div>
				</aside>
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
}
