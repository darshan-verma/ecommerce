import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	CreditCard,
	Package,
	ShoppingBag,
	User as UserIcon,
} from "lucide-react";
import Link from "next/link";

export default async function AccountPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/signin?callbackUrl=/account");
	}

	const user = session.user;

	// Mock data - replace with actual data from your database
	const stats = [
		{ name: "Total Orders", value: "5", icon: ShoppingBag },
		{ name: "Wishlist Items", value: "3", icon: Package },
		{ name: "Saved Cards", value: "2", icon: CreditCard },
	];

	// Mock recent orders - replace with actual data from your database
	const recentOrders = [
		{ id: "1234", date: "2023-06-15", total: 99.99, status: "Delivered" },
		{ id: "1233", date: "2023-06-10", total: 149.99, status: "Shipped" },
	];

	return (
		<div className="space-y-8">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Welcome back, {user?.name?.split(" ")[0] || "User"}!
					</h1>
					<p className="text-muted-foreground">
						Here's what's happening with your orders and account.
					</p>
				</div>
				<Button asChild>
					<Link href="/products">Continue Shopping</Link>
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-3">
				{stats.map((stat) => (
					<Card key={stat.name}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Recent Orders */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Orders</CardTitle>
				</CardHeader>
				<CardContent>
					{recentOrders.length > 0 ? (
						<div className="space-y-4">
							{recentOrders.map((order) => (
								<div
									key={order.id}
									className="flex items-center justify-between p-4 border rounded-lg"
								>
									<div>
										<p className="font-medium">Order #{order.id}</p>
										<p className="text-sm text-muted-foreground">
											{new Date(order.date).toLocaleDateString()}
										</p>
									</div>
									<div className="text-right">
										<p className="font-medium">${order.total.toFixed(2)}</p>
										<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
											{order.status}
										</div>
									</div>
								</div>
							))}
							<Button variant="outline" className="w-full mt-4" asChild>
								<Link href="/account/orders">View All Orders</Link>
							</Button>
						</div>
					) : (
						<div className="text-center py-8">
							<Package className="mx-auto h-12 w-12 text-muted-foreground" />
							<h3 className="mt-2 text-sm font-medium">No orders yet</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								Get started by placing your first order.
							</p>
							<Button className="mt-4" asChild>
								<Link href="/products">Browse Products</Link>
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Account Details */}
			<Card>
				<CardHeader>
					<CardTitle>Account Details</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<div className="flex-shrink-0">
								<div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
									<UserIcon className="h-6 w-6 text-gray-500" />
								</div>
							</div>
							<div>
								<h4 className="font-medium">{user?.name || "User"}</h4>
								<p className="text-sm text-muted-foreground">{user?.email}</p>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
							<div>
								<h4 className="text-sm font-medium mb-2">
									Contact Information
								</h4>
								<p className="text-sm text-muted-foreground">{user?.email}</p>
								<Button variant="link" className="p-0 h-auto" asChild>
									<Link href="/account/settings">Edit</Link>
								</Button>
							</div>
							<div>
								<h4 className="text-sm font-medium mb-2">Newsletter</h4>
								<p className="text-sm text-muted-foreground">
									You are currently not subscribed to our newsletter.
								</p>
								<Button variant="link" className="p-0 h-auto" asChild>
									<Link href="/account/settings#newsletter">Subscribe</Link>
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
