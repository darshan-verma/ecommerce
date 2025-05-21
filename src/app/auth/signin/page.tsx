"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignInPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const error = searchParams.get("error");
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	useEffect(() => {
		if (error) {
			toast.error("Sign in failed. Please try again.");
		}
	}, [error]);

	const handleGoogleSignIn = async () => {
		try {
			await signIn("google", { callbackUrl });
		} catch (error) {
			console.error("Error signing in with Google:", error);
			toast.error("Failed to sign in with Google. Please try again.");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Welcome back
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Sign in to your account to continue shopping
					</p>
				</div>

				<div className="mt-8 space-y-6">
					<Button
						onClick={handleGoogleSignIn}
						variant="outline"
						className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						<span className="flex items-center">
							<FcGoogle className="mr-2 h-5 w-5" />
							Sign in with Google
						</span>
					</Button>

					<div className="relative mt-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">
								Don't have an account?
							</span>
						</div>
					</div>

					<p className="mt-2 text-center text-sm text-gray-600">
						By continuing, you agree to our{" "}
						<Link
							href="/terms"
							className="font-medium text-primary hover:text-primary/80"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							className="font-medium text-primary hover:text-primary/80"
						>
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	);
}
