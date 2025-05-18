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

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOption, setSortOption] = useState("newest");
	const [categories, setCategories] = useState<string[]>([]);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [pagination, setPagination] = useState({
		page: 1,
		pages: 1,
		total: 0,
		perPage: 12,
	});

	const useDebounce = (value: string, delay: number) => {
		const [debouncedValue, setDebouncedValue] = useState(value);

		useEffect(() => {
			const handler = setTimeout(() => {
				setDebouncedValue(value);
			}, delay);

			return () => {
				clearTimeout(handler);
			};
		}, [value, delay]);

		return debouncedValue;
	};

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	const fetchProducts = useCallback(
		async (page = 1) => {
			try {
				setLoading(true);

				const url = new URL("/api/products", window.location.origin);
				url.searchParams.set("page", page.toString());
				url.searchParams.set("limit", "12");

				if (debouncedSearchQuery) {
					url.searchParams.set("keyword", debouncedSearchQuery);
				}

				if (selectedCategory !== "all") {
					url.searchParams.set("category", selectedCategory);
				}

				const response = await fetch(url.toString());
				const data = await response.json();

				setProducts(data.products || []);

				setPagination({
					page: data.page || 1,
					pages: data.pages || 1,
					total: data.total || 0,
					perPage: 12,
				});

				const uniqueCategories = [
					...new Set<string>(
						(data.products || [])
							.map((p: Product) => p.category)
							.filter((category: string): category is string =>
								Boolean(category)
							)
					),
				];
				setCategories(uniqueCategories);
			} catch (error) {
				console.error("Error in fetchProducts:", error);
				setProducts([]);
			} finally {
				setLoading(false);
			}
		},
		[debouncedSearchQuery, selectedCategory]
	);

	useEffect(() => {
		const fetchData = async () => {
			await fetchProducts(1);
		};
		fetchData();
	}, [debouncedSearchQuery, selectedCategory, fetchProducts]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setSearchQuery(e.target.value);
	};

	const filteredProducts = useMemo(() => {
		let result = [...products];

		if (selectedCategory !== "all") {
			result = result.filter(
				(product) => product.category === selectedCategory
			);
		}

		if (debouncedSearchQuery) {
			const query = debouncedSearchQuery.toLowerCase();
			result = result.filter(
				(product) =>
					product.name.toLowerCase().includes(query) ||
					product.description.toLowerCase().includes(query)
			);
		}

		return result.sort((a, b) => {
			switch (sortOption) {
				case "price-asc":
					return a.price - b.price;
				case "price-desc":
					return b.price - a.price;
				case "name-asc":
					return a.name.localeCompare(b.name);
				case "name-desc":
					return b.name.localeCompare(a.name);
				case "newest":
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				case "oldest":
					return (
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);
				default:
					return 0;
			}
		});
	}, [products, sortOption, debouncedSearchQuery, selectedCategory]);

	if (loading) {
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
						{filteredProducts.length} products found
						{debouncedSearchQuery ? ` for "${debouncedSearchQuery}"` : ""}
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
							onChange={handleSearchChange}
						/>
					</div>
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="All Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category} value={category}>
									{category}
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

			{filteredProducts.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">
						{debouncedSearchQuery || selectedCategory !== "all"
							? "No products match your filters."
							: "No products available."}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{filteredProducts.map((product) => (
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

			{pagination.pages > 1 && (
				<div className="flex justify-center mt-8 space-x-4">
					<Button
						onClick={() => fetchProducts(pagination.page - 1)}
						disabled={pagination.page === 1 || loading}
						variant="outline"
					>
						Previous
					</Button>
					<span className="flex items-center px-4">
						Page {pagination.page} of {pagination.pages}
					</span>
					<Button
						onClick={() => fetchProducts(pagination.page + 1)}
						disabled={pagination.page === pagination.pages || loading}
						variant="outline"
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}
