"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiLoader, FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{}
	);

	const validateForm = () => {
		const newErrors: { email?: string; password?: string } = {};
		if (!email) newErrors.email = "Email is required";
		if (!password) newErrors.password = "Password is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});

			if (result?.error) {
				throw new Error(result.error);
			}

			router.push("/admin/analytics");
		} catch (error) {
			toast({
				title: "Authentication Failed",
				description: "Invalid email or password. Please try again.",
				// variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		try {
			await signIn("google", { callbackUrl: "/admin/analytics" });
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to sign in with Google. Please try again.",
				// variant: "destructive",
			});
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-extrabold text-gray-900">
						Admin Portal
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Sign in to access the dashboard
					</p>
				</div>

				<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label
								htmlFor="email"
								className="text-sm font-medium text-gray-700"
							>
								Email address
							</Label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FiMail className="h-5 w-5 text-gray-400" />
								</div>
								<Input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									placeholder="Enter your email"
									className={`pl-10 ${errors.email ? "border-red-300" : ""}`}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600 flex items-center">
									<FiAlertCircle className="mr-1 h-4 w-4" /> {errors.email}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label
									htmlFor="password"
									className="text-sm font-medium text-gray-700"
								>
									Password
								</Label>
								<a
									href="#"
									className="text-sm font-medium text-blue-600 hover:text-blue-500"
								>
									Forgot password?
								</a>
							</div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FiLock className="h-5 w-5 text-gray-400" />
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									placeholder="Enter your password"
									className={`pl-10 ${errors.password ? "border-red-300" : ""}`}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600 flex items-center">
									<FiAlertCircle className="mr-1 h-4 w-4" /> {errors.password}
								</p>
							)}
						</div>

						<div>
							<Button
								type="submit"
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
										Signing in...
									</>
								) : (
									"Sign in"
								)}
							</Button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						<div className="mt-6">
							<Button
								variant="outline"
								type="button"
								className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								onClick={handleGoogleSignIn}
								disabled={isLoading}
							>
								<FcGoogle className="h-5 w-5 mr-2" />
								Sign in with Google
							</Button>
						</div>
					</div>
				</div>

				<div className="text-center text-sm text-gray-600">
					<p>Don't have an account? Contact your system administrator.</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
