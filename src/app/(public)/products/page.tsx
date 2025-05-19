"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Search } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface Product {
	_id: string;
	name: string;
	price: number;
	description: string;
	images: { url: string }[];
	stock: number;
	category: string;
	createdAt: string;
	ratings?: number;
}

interface Category {
	_id: string;
	name: string;
	slug: string;
}

export default function ProductsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>(
		searchParams.get("category") || ""
	);
	const [searchQuery, setSearchQuery] = useState(
		searchParams.get("keyword") || ""
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sortOption, setSortOption] = useState("newest");

	const updateUrl = useCallback(
		(updates: { category?: string; keyword?: string }) => {
			const params = new URLSearchParams(searchParams);

			if (updates.category !== undefined) {
				if (updates.category) {
					params.set("category", updates.category);
				} else {
					params.delete("category");
				}
			}

			if (updates.keyword !== undefined) {
				if (updates.keyword) {
					params.set("keyword", updates.keyword);
				} else {
					params.delete("keyword");
				}
			}

			// Update URL without page reload
			router.push(`?${params.toString()}`, { scroll: false });
		},
		[router, searchParams]
	);

	const handleCategoryChange = useCallback(
		(value: string) => {
			const newCategory = value === "all" ? "" : value;
			setSelectedCategory(newCategory);
			updateUrl({ category: newCategory });
		},
		[updateUrl]
	);

	const handleSearch = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setSearchQuery(value);

			// Debounce search updates
			const timer = setTimeout(() => {
				updateUrl({ keyword: value });
			}, 500);

			return () => clearTimeout(timer);
		},
		[updateUrl]
	);

	const fetchProducts = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const params = new URLSearchParams();
			if (searchQuery) params.set("keyword", searchQuery);
			if (selectedCategory) params.set("category", selectedCategory);

			const response = await fetch(`/api/products?${params.toString()}`);
			if (!response.ok) throw new Error("Failed to fetch products");

			const data = await response.json();
			setProducts(data.products || []);
		} catch (error) {
			console.error("Error fetching products:", error);
			setError("Failed to load products. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	}, [searchQuery, selectedCategory]);

	const fetchCategories = useCallback(async () => {
		try {
			const response = await fetch("/api/categories/active");
			if (!response.ok) throw new Error("Failed to fetch categories");
			const data = await response.json();
			setCategories(data);
		} catch (error) {
			console.error("Error fetching categories:", error);
			setError("Failed to load categories");
		}
	}, []);

	useEffect(() => {
		fetchCategories();
		fetchProducts();
	}, [fetchCategories, fetchProducts]);

	const filteredAndSortedProducts = useMemo(() => {
		let result = [...products];

		switch (sortOption) {
			case "price-asc":
				result.sort((a, b) => a.price - b.price);
				break;
			case "price-desc":
				result.sort((a, b) => b.price - a.price);
				break;
			case "name-asc":
				result.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case "name-desc":
				result.sort((a, b) => b.name.localeCompare(a.name));
				break;
			case "newest":
				result.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				break;
			default:
				break;
		}

		return result;
	}, [products, sortOption]);

	if (isLoading) {
		return (
			<div className="container mx-auto py-8 px-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{[...Array(12)].map((_, i) => (
						<Card key={i} className="overflow-hidden">
							<CardContent className="p-4 space-y-2"></CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-bold">Our Products</h1>
					<p className="text-muted-foreground">
						{filteredAndSortedProducts.length} products found
						{searchQuery ? ` for "${searchQuery}"` : ""}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
					<div className="relative w-full sm:w-64">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search products..."
							className="pl-9"
							value={searchQuery}
							onChange={handleSearch}
						/>
					</div>
					<Select
						value={selectedCategory || "all"}
						onValueChange={handleCategoryChange}
					>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="All Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category._id} value={category._id}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={sortOption} onValueChange={setSortOption}>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Newest</SelectItem>
							<SelectItem value="oldest">Oldest</SelectItem>
							<SelectItem value="price-asc">Price: Low to High</SelectItem>
							<SelectItem value="price-desc">Price: High to Low</SelectItem>
							<SelectItem value="name-asc">Name: A to Z</SelectItem>
							<SelectItem value="name-desc">Name: Z to A</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{filteredAndSortedProducts.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">
						{searchQuery || selectedCategory
							? "No products match your filters."
							: "No products available."}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{filteredAndSortedProducts.map((product) => (
						<Link key={product._id} href={`/products/${product._id}`}>
							<Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
								<div className="relative aspect-square overflow-hidden">
									{product.images?.[0]?.url ? (
										<img
											src={product.images[0].url}
											alt={product.name}
											className="object-cover w-full h-full"
										/>
									) : (
										<div className="w-full h-full bg-muted flex items-center justify-center">
											<span className="text-muted-foreground">No image</span>
										</div>
									)}
									{product.stock === 0 && (
										<Badge
											variant="destructive"
											className="absolute top-2 right-2"
										>
											Out of Stock
										</Badge>
									)}
								</div>
								<CardContent className="p-4 flex-1 flex flex-col">
									<div className="flex-1">
										<h3 className="font-semibold line-clamp-2">
											{product.name}
										</h3>
										<p className="text-muted-foreground text-sm line-clamp-2 mt-1">
											{product.description}
										</p>
										<div className="flex items-center mt-2">
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<span className="ml-1 text-sm">
												{product.ratings?.toFixed(1) || "New"}
											</span>
										</div>
										<p className="font-bold text-lg mt-2">
											${product.price.toFixed(2)}
										</p>
									</div>
								</CardContent>
								<CardFooter className="p-4 pt-0">
									<Button className="w-full" disabled={product.stock === 0}>
										<ShoppingCart className="mr-2 h-4 w-4" />
										{product.stock > 0 ? "Add to Cart" : "Out of Stock"}
									</Button>
								</CardFooter>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
