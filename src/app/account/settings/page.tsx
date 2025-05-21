import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Mail, Lock, Bell } from "lucide-react";

export default async function AccountSettingsPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/signin?callbackUrl=/account/settings");
	}

	const user = session.user;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
				<p className="text-muted-foreground">
					Manage your account information and preferences
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>
						Update your account's profile information and email address.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<div className="flex items-center gap-2">
								<div className="relative flex-1">
									<UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="name"
										name="name"
										type="text"
										defaultValue={user?.name || ""}
										className="pl-9"
									/>
								</div>
								<Button type="submit" variant="outline">
									Save
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="flex items-center gap-2">
								<div className="relative flex-1">
									<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="email"
										name="email"
										type="email"
										defaultValue={user?.email || ""}
										className="pl-9"
										disabled
									/>
								</div>
								<Button type="button" variant="outline" disabled>
									Change
								</Button>
							</div>
							<p className="text-xs text-muted-foreground">
								To change your email, please contact support.
							</p>
						</div>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>
						Ensure your account is using a long, random password to stay secure.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="current-password">Current Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="current-password"
									name="currentPassword"
									type="password"
									className="pl-9"
									placeholder="Enter your current password"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="new-password">New Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="new-password"
									name="newPassword"
									type="password"
									className="pl-9"
									placeholder="Enter your new password"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirm-password">Confirm New Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="confirm-password"
									name="confirmPassword"
									type="password"
									className="pl-9"
									placeholder="Confirm your new password"
								/>
							</div>
						</div>

						<div className="flex justify-end">
							<Button type="submit">Update Password</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Notification Preferences</CardTitle>
					<CardDescription>
						Manage how you receive notifications.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="email-notifications">Email Notifications</Label>
								<p className="text-sm text-muted-foreground">
									Receive email notifications about your account and orders.
								</p>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-sm text-muted-foreground">
									{user?.email}
								</span>
								<Button variant="outline" size="sm">
									<Bell className="mr-2 h-4 w-4" />
									Manage
								</Button>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="marketing-emails">Marketing Emails</Label>
								<p className="text-sm text-muted-foreground">
									Receive emails about new products, features, and more.
								</p>
							</div>
							<div className="flex items-center space-x-2">
								<Button variant="outline" size="sm">
									<Bell className="mr-2 h-4 w-4" />
									Subscribe
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="border-destructive/20 bg-destructive/5">
				<CardHeader>
					<CardTitle className="text-destructive">Danger Zone</CardTitle>
					<CardDescription className="text-destructive/80">
						These actions are irreversible. Proceed with caution.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
						<div>
							<h4 className="font-medium">Delete Account</h4>
							<p className="text-sm text-destructive/80">
								Permanently delete your account and all of your data.
							</p>
						</div>
						<Button variant="destructive">Delete Account</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
