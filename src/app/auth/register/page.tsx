"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
	FiUser,
	FiMail,
	FiLock,
	FiLoader,
	FiAlertCircle,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

const RegisterPage = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<{
		name?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});

	const validateForm = () => {
		const newErrors: typeof errors = {};
		if (!formData.name) newErrors.name = "Name is required";
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Registration failed");
			}

			toast({
				title: "Registration Successful",
				description: "Your account has been created successfully!",
			});

			// Redirect to login page after successful registration
			router.push("/auth/login");
		} catch (error) {
			toast({
				title: "Registration Failed",
				description:
					error instanceof Error ? error.message : "Something went wrong",
				// variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-extrabold text-gray-900">
						Create an Account
					</h1>
					<p className="mt-2 text-sm text-gray-600">Join our community today</p>
				</div>

				<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label
								htmlFor="name"
								className="text-sm font-medium text-gray-700"
							>
								Full Name
							</Label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FiUser className="h-5 w-5 text-gray-400" />
								</div>
								<Input
									id="name"
									name="name"
									type="text"
									autoComplete="name"
									placeholder="Enter your full name"
									className={`pl-10 ${errors.name ? "border-red-300" : ""}`}
									value={formData.name}
									onChange={handleChange}
								/>
							</div>
							{errors.name && (
								<p className="mt-1 text-sm text-red-600 flex items-center">
									<FiAlertCircle className="mr-1 h-4 w-4" /> {errors.name}
								</p>
							)}
						</div>

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
									value={formData.email}
									onChange={handleChange}
								/>
							</div>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600 flex items-center">
									<FiAlertCircle className="mr-1 h-4 w-4" /> {errors.email}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="password"
								className="text-sm font-medium text-gray-700"
							>
								Password
							</Label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FiLock className="h-5 w-5 text-gray-400" />
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									autoComplete="new-password"
									placeholder="Create a password"
									className={`pl-10 ${errors.password ? "border-red-300" : ""}`}
									value={formData.password}
									onChange={handleChange}
								/>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600 flex items-center">
									<FiAlertCircle className="mr-1 h-4 w-4" /> {errors.password}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="confirmPassword"
								className="text-sm font-medium text-gray-700"
							>
								Confirm Password
							</Label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FiLock className="h-5 w-5 text-gray-400" />
								</div>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									autoComplete="new-password"
									placeholder="Confirm your password"
									className={`pl-10 ${
										errors.confirmPassword ? "border-red-300" : ""
									}`}
									value={formData.confirmPassword}
									onChange={handleChange}
								/>
							</div>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-600 flex items-center">
									<FiAlertCircle className="mr-1 h-4 w-4" />{" "}
									{errors.confirmPassword}
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
										Creating Account...
									</>
								) : (
									"Create Account"
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
								disabled={isLoading}
							>
								<FcGoogle className="h-5 w-5 mr-2" />
								Sign up with Google
							</Button>
						</div>
					</div>
				</div>

				<div className="text-center text-sm text-gray-600">
					<p>
						Already have an account?{" "}
						<Link
							href="/auth/login"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
