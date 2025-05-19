"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductForm } from "@/components/forms/ProductForm";
import { IProduct } from "@/models/Product";
import { Button, toast, Toast } from "@/components/ui";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface Category {
	_id: string;
	name: string;
	slug: string;
}

// Custom hook for debouncing
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

export default function AdminProductsPage() {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearchQuery = useDebounce(searchQuery, 500);
	const [sortOption, setSortOption] = useState("newest");
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		page: 1,
		pages: 1,
		total: 0,
		perPage: 9,
	});
	const isMounted = useRef(true);

	// Fetch categories
	const fetchCategories = useCallback(async () => {
		try {
			const response = await fetch("/api/categories/active");
			if (!response.ok) {
				throw new Error("Failed to fetch categories");
			}
			const data = await response.json();
			setCategories(data);
		} catch (error) {
			console.error("Error fetching categories:", error);
			toast({
				title: "Error",
				description: "Failed to load categories",
				// variant: "destructive",
			});
		}
	}, []);

	// Fetch products with pagination
	const fetchProducts = useCallback(
		async (page = 1) => {
			try {
				setIsLoading(true);
				setError(null);

				const url = new URL("/api/products", window.location.origin);
				url.searchParams.set("page", page.toString());
				url.searchParams.set("limit", "9");

				if (debouncedSearchQuery) {
					url.searchParams.set("keyword", debouncedSearchQuery);
				}

				if (selectedCategory) {
					url.searchParams.set("category", selectedCategory);
				}

				console.log("Fetching products...", url.toString());
				const response = await fetch(url.toString(), {
					cache: "no-store",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				console.log("API Response data:", data);

				// Only update state if component is still mounted
				if (isMounted.current) {
					setProducts(data.products || []);
					setPagination({
						page: data.page || 1,
						pages: data.pages || 1,
						total: data.total || 0,
						perPage: 9,
					});
				}
			} catch (error) {
				console.error("Error fetching products:", error);
				if (isMounted.current) {
					setError("Failed to load products. Please try again later.");
				}
			} finally {
				if (isMounted.current) {
					setIsLoading(false);
				}
			}
		},
		[debouncedSearchQuery, selectedCategory]
	);

	// Fetch products when debounced search query changes
	useEffect(() => {
		fetchProducts(1);
	}, [debouncedSearchQuery, fetchProducts]);

	// Fetch categories on component mount
	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	// Filter and sort products
	const filteredAndSortedProducts = useMemo(() => {
		let result = [...products];

		// Apply search
		if (debouncedSearchQuery) {
			const query = debouncedSearchQuery.toLowerCase();
			result = result.filter(
				(product) =>
					product.name.toLowerCase().includes(query) ||
					product.description.toLowerCase().includes(query) ||
					product.category.toLowerCase().includes(query)
			);
		}

		// Apply sorting
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
			case "oldest":
				result.sort(
					(a, b) =>
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
				break;
			default:
				break;
		}

		return result;
	}, [products, debouncedSearchQuery, sortOption]);

	// Handle form submission
	const handleSubmit = async (data: any) => {
		try {
			const response = await fetch("/api/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					images: [
						{
							public_id: `product_${Date.now()}`,
							url: data.imageUrl,
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create product");
			}

			const newProduct = await response.json();

			// Add the new product to the products array
			setProducts((prevProducts) => [...prevProducts, newProduct]);

			// Switch to the products list tab
			// You'll need to add state for the active tab
			// const [activeTab, setActiveTab] = useState("list");
			// Then uncomment this:
			// setActiveTab("list");

			toast({
				title: "Success",
				description: "Product created successfully",
			});
		} catch (error) {
			console.error("Error creating product:", error);
			toast({
				title: "Error",
				description: "Failed to create product",
				// variant: "destructive",
			});
			throw error;
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto p-6">
				<div className="bg-red-50 border-l-4 border-red-400 p-4">
					<div className="flex">
						<div className="flex-shrink-0">
							<svg
								className="h-5 w-5 text-red-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<p className="text-sm text-red-700">{error}</p>
							<button
								onClick={() => fetchProducts(1)} // Explicitly pass the page number
								className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
							>
								<span aria-hidden="true">&larr;</span> Retry
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
				<div>
					<h1 className="text-3xl font-bold">Products</h1>
					<p className="text-muted-foreground">Manage your products</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
					<div className="flex gap-4 mb-6">
						<div className="w-full max-w-xs">
							<Select
								value={selectedCategory}
								onValueChange={(value) => {
									setSelectedCategory(value === "all" ? "" : value);
									setPagination((prev) => ({ ...prev, page: 1 }));
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Filter by category" />
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
						</div>
						<Input
							type="text"
							placeholder="Search products..."
							value={searchQuery}
							onChange={handleSearchChange}
							className="w-full md:w-64"
						/>
						<Select value={sortOption} onValueChange={setSortOption}>
							<SelectTrigger className="w-full md:w-48">
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
			</div>

			<Tabs defaultValue="list" className="space-y-4">
				<TabsList>
					<TabsTrigger value="list">
						All Products ({filteredAndSortedProducts.length})
					</TabsTrigger>
					<TabsTrigger value="add">Add New Product</TabsTrigger>
				</TabsList>

				<TabsContent value="list" className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex justify-between items-center">
								<div>
									<CardTitle>All Products</CardTitle>
									<CardDescription>
										{filteredAndSortedProducts.length} products found
										{debouncedSearchQuery
											? ` for "${debouncedSearchQuery}"`
											: ""}
									</CardDescription>
								</div>
								{debouncedSearchQuery && (
									<Button
										variant="ghost"
										onClick={() => setSearchQuery("")}
										className="text-sm"
									>
										Clear search
									</Button>
								)}
							</div>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="flex justify-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
								</div>
							) : filteredAndSortedProducts.length === 0 ? (
								<div className="text-center py-12">
									<p className="text-muted-foreground">
										{debouncedSearchQuery
											? "No products match your search criteria."
											: "No products found. Add your first product to get started!"}
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{filteredAndSortedProducts.map((product) => (
										<Card key={product._id.toString()}>
											<CardContent className="p-4">
												<img
													src={product.images?.[0]?.url || "/placeholder.svg"}
													alt={product.name}
													className="w-full h-48 object-cover rounded-md mb-4"
												/>
												<h3 className="font-semibold">{product.name}</h3>
												<p className="text-sm text-muted-foreground">
													${product.price.toFixed(2)}
												</p>
												<p className="text-sm text-muted-foreground">
													{product.stock} in stock
												</p>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="add">
					<Card>
						<CardHeader>
							<CardTitle>Add New Product</CardTitle>
							<CardDescription>Add a new product to your store</CardDescription>
						</CardHeader>
						<CardContent>
							<ProductForm onSubmit={handleSubmit} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{pagination.pages > 1 && (
				<div className="flex justify-center mt-8 gap-4">
					<Button
						onClick={() => fetchProducts(pagination.page - 1)}
						disabled={pagination.page === 1 || isLoading}
						variant="outline"
					>
						Previous
					</Button>
					<span className="flex items-center px-4">
						Page {pagination.page} of {pagination.pages}
					</span>
					<Button
						onClick={() => fetchProducts(pagination.page + 1)}
						disabled={pagination.page === pagination.pages || isLoading}
						variant="outline"
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}
