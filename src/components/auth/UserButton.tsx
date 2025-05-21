"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, ShoppingBag, Settings, Loader2 } from "lucide-react";
import Link from "next/link";

export function UserButton() {
	const { data: session, status } = useSession();
	const isLoading = status === "loading";

	if (isLoading) {
		return (
			<Button variant="ghost" size="icon" disabled>
				<Loader2 className="h-5 w-5 animate-spin" />
			</Button>
		);
	}

	if (!session) {
		return (
			<Button
				onClick={() => signIn("google")}
				variant="outline"
				size="sm"
				className="hidden sm:flex"
			>
				<User className="mr-2 h-4 w-4" />
				Sign In
			</Button>
		);
	}

	const user = session.user;
	const userInitial = user?.name?.[0]?.toUpperCase() || "U";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative h-9 w-9 rounded-full"
				>
					<Avatar className="h-8 w-8">
						{user?.image ? (
							<AvatarImage
								src={user.image}
								alt={user.name || "User"}
								referrerPolicy="no-referrer"
							/>
						) : (
							<AvatarFallback className="bg-primary/10 text-primary">
								{userInitial}
							</AvatarFallback>
						)}
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<div className="flex items-center gap-3 p-2">
					<Avatar className="h-10 w-10">
						{user?.image ? (
							<AvatarImage
								src={user.image}
								alt={user.name || "User"}
								referrerPolicy="no-referrer"
							/>
						) : (
							<AvatarFallback className="bg-primary/10 text-primary">
								{userInitial}
							</AvatarFallback>
						)}
					</Avatar>
					<div className="flex flex-col">
						<p className="text-sm font-medium">{user?.name || "User"}</p>
						<p className="text-xs text-muted-foreground">{user?.email}</p>
					</div>
				</div>

				<DropdownMenuItem asChild>
					<Link href="/account" className="cursor-pointer">
						<User className="mr-2 h-4 w-4" />
						<span>My Profile</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link href="/account/orders" className="cursor-pointer">
						<ShoppingBag className="mr-2 h-4 w-4" />
						<span>My Orders</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link href="/account/settings" className="cursor-pointer">
						<Settings className="mr-2 h-4 w-4" />
						<span>Account Settings</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={() => signOut({ callbackUrl: "/" })}
					className="cursor-pointer text-red-600 focus:text-red-600"
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
