"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Category {
	_id: string;
	name: string;
	slug: string;
	image?: string;
	description?: string;
}

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/categories/active");
				if (!response.ok) throw new Error("Failed to fetch categories");
				const data = await response.json();
				console.log("Fetched categories:", JSON.stringify(data, null, 2)); // Log the full response
				setCategories(data);
			} catch (error) {
				console.error("Error fetching categories:", error);
				setError("Failed to load categories. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	if (loading) {
		return (
			<div className="container mx-auto py-12 px-4">
				<h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{[...Array(8)].map((_, i) => (
						<Card key={i} className="overflow-hidden h-48">
							<CardContent className="p-0 h-full"></CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto py-12 px-4 text-center">
				<p className="text-red-500 mb-4">{error}</p>
				<Button onClick={() => window.location.reload()}>Try Again</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-12 px-4">
			<h1 className="text-3xl font-bold mb-8">Shop by Category</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{categories.map((category) => (
					<Link
						key={category._id}
						href={`/products?category=${category._id}`}
						className="block h-full"
					>
						<Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
							<div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
								{category.image ? (
									<img
										src={
											category.image.startsWith("http")
												? category.image
												: category.image.startsWith("/")
												? category.image
												: `/${category.image.replace(/^\/+/, "")}`
										}
										alt={category.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										onError={(e) => {
											console.error(
												"Failed to load image:",
												e.currentTarget.src
											);
											e.currentTarget.onerror = null;
											e.currentTarget.src = "/placeholder-category.png";
										}}
										onLoad={() =>
											console.log("Image loaded successfully:", category.name)
										}
									/>
								) : (
									<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
										<span className="text-4xl text-gray-400">
											{category.name.charAt(0)}
										</span>
									</div>
								)}
							</div>
							<CardContent className="p-4 text-center">
								<h3 className="font-semibold text-lg">{category.name}</h3>
								{category.description && (
									<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
										{category.description}
									</p>
								)}
								<Button variant="link" className="mt-2">
									Shop Now
								</Button>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
