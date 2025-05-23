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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Category {
	_id: string;
	name: string;
	slug: string;
}

type ProductData = {
	_id: string;
	name: string;
	description: string;
	price: number;
	images: Array<{ public_id: string; url: string }>;
	category: string;
	stock: number;
	ratings: number;
	reviews: Array<{
		user: string;
		name: string;
		rating: number;
		comment: string;
	}>;
	createdAt: string;
	updatedAt: string;
	imageUrl: string;
};

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
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOption, setSortOption] = useState("newest");
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		pages: 1,
	});
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState<string | null>(null);
	const [editingProduct, setEditingProduct] = useState<ProductData | null>(
		null
	);
	const [activeTab, setActiveTab] = useState("list");
	const debouncedSearchQuery = useDebounce(searchQuery, 500);
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
		async (pageNumber: number) => {
			try {
				setIsLoading(true);
				setError(null);

				// Build the query parameters
				const params = new URLSearchParams({
					page: pageNumber.toString(),
					limit: "10",
				});

				// Add category filter if selected
				if (selectedCategory && selectedCategory !== "all") {
					params.append("category", selectedCategory);
				}

				// Add search term if provided
				if (debouncedSearchQuery) {
					params.append("keyword", debouncedSearchQuery);
				}

				const apiUrl = `/api/products?${params.toString()}`;
				console.log("Fetching products from:", apiUrl);

				const response = await fetch(apiUrl);

				if (!response.ok) {
					const errorText = await response.text();
					console.error("API Error Response:", {
						status: response.status,
						statusText: response.statusText,
						headers: Object.fromEntries(response.headers.entries()),
						body: errorText,
					});
					throw new Error(
						`Failed to fetch products: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.json();
				console.log("API Response Data:", data);

				if (!data.products) {
					console.error("Unexpected API response format:", data);
					throw new Error("Invalid response format from server");
				}

				setProducts(data.products);

				// Update pagination state to match API response
				setPagination({
					page: data.page || 1,
					pages: data.totalPages || 1,
					total: data.totalProducts || 0,
					limit: 10,
				});
			} catch (err) {
				console.error("Error in fetchProducts:", {
					error: err,
					message: err instanceof Error ? err.message : "Unknown error",
					stack: err instanceof Error ? err.stack : undefined,
				});
				setError("Failed to load products. Please try again.");
			} finally {
				setIsLoading(false);
			}
		},
		[selectedCategory, debouncedSearchQuery]
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
		console.log("Sorting products...");
		let result = [...products];

		// Only apply sorting, filtering is done by the API
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
	}, [products, sortOption]);

	// Handle form submission
	const handleSubmit = async (data: any) => {
		try {
			setIsSubmitting(true);
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

			// Switch to the products list tab and refresh the data
			setActiveTab("list");
			await fetchProducts(1);

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
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle update product
	const handleUpdateProduct = async (data: any) => {
		try {
			setIsSubmitting(true);
			const response = await fetch(`/api/products/${editingProduct?._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					images: [
						{
							public_id:
								editingProduct?.images?.[0]?.public_id ||
								`product_${Date.now()}`,
							url: data.imageUrl,
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update product");
			}

			// Switch to the products list tab and refresh the data
			setActiveTab("list");
			await fetchProducts(pagination.page);

			toast({
				title: "Success",
				description: "Product updated successfully",
			});

			setEditingProduct(null);
		} catch (error) {
			console.error("Error updating product:", error);
			toast({
				title: "Error",
				description: "Failed to update product",
				// variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle delete product
	const handleDeleteClick = (productId: string) => {
		setProductToDelete(productId);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!productToDelete) return;

		try {
			setIsLoading(true);
			const response = await fetch(`/api/products/${productToDelete}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete product");
			}

			// Remove the product from the local state
			setProducts(
				products.filter((product) => product._id !== productToDelete)
			);
			toast({
				title: "Success",
				description: "Product deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting product:", error);
			toast({
				title: "Error",
				description: "Failed to delete product",
				// variant: "destructive",
			});
		} finally {
			setIsLoading(false);
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);
		}
	};

	// Handle edit product
	const handleEditClick = (product: IProduct) => {
		// Safely extract the category ID
		const getCategoryId = (category: any): string => {
			if (!category) return "";
			if (typeof category === "string") return category;
			return category._id?.toString() || "";
		};

		// Get the first image URL if available
		const firstImageUrl = product.images?.[0]?.url || "";

		// Create a plain object with the product data
		const productData: ProductData = {
			_id: product._id?.toString() || "",
			name: product.name || "",
			description: product.description || "",
			price: product.price || 0,
			images: Array.isArray(product.images)
				? product.images.map((img) => ({
						public_id: img?.public_id || "",
						url: img?.url || "",
				  }))
				: [],
			category: getCategoryId(product.category),
			stock: product.stock || 0,
			ratings: product.ratings || 0,
			reviews: Array.isArray(product.reviews)
				? product.reviews.map((review) => ({
						user: review.user?.toString() || "",
						name: review.name || "",
						rating: review.rating || 0,
						comment: review.comment || "",
				  }))
				: [],
			createdAt: product.createdAt?.toString() || new Date().toISOString(),
			updatedAt: product.updatedAt?.toString() || new Date().toISOString(),
			// Add the imageUrl field that the form expects
			imageUrl: firstImageUrl,
		};

		setEditingProduct(productData);
		setActiveTab("add"); // Switch to the form tab
	};

	const handleCancelEdit = () => {
		setEditingProduct(null);
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
									console.log("Category selected:", value);
									setSelectedCategory(value);
									setPagination((prev) => ({ ...prev, page: 1 }));
									fetchProducts(1); // Trigger a new fetch when category changes
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

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList>
					<TabsTrigger value="list">
						All Products ({filteredAndSortedProducts.length})
					</TabsTrigger>
					<TabsTrigger
						value="add"
						onClick={() => {
							setEditingProduct(null);
							setActiveTab("add");
						}}
					>
						{editingProduct ? "Cancel Edit" : "Add New Product"}
					</TabsTrigger>
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
								<div className="rounded-md border">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="w-[100px]">Image</TableHead>
												<TableHead>Name</TableHead>
												<TableHead>Category</TableHead>
												<TableHead className="text-right">Price</TableHead>
												<TableHead className="text-center">Stock</TableHead>
												<TableHead className="text-right">Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{filteredAndSortedProducts.map((product) => {
												const category = categories.find(
													(cat) => cat._id === product.category
												);
												return (
													<TableRow key={product._id.toString()}>
														<TableCell>
															<img
																src={
																	product.images?.[0]?.url || "/placeholder.svg"
																}
																alt={product.name}
																className="h-12 w-12 rounded-md object-cover"
															/>
														</TableCell>
														<TableCell className="font-medium">
															{product.name}
														</TableCell>
														<TableCell>
															<Badge variant="outline">
																{category?.name || "Uncategorized"}
															</Badge>
														</TableCell>
														<TableCell className="text-right">
															${product.price.toFixed(2)}
														</TableCell>
														<TableCell className="text-center">
															<Badge
																variant={
																	product.stock > 0 ? "default" : "destructive"
																}
															>
																{product.stock} in stock
															</Badge>
														</TableCell>
														<TableCell className="text-right">
															<div className="flex justify-end gap-2">
																<Button
																	variant="ghost"
																	size="icon"
																	onClick={() => handleEditClick(product)}
																>
																	<Pencil className="h-4 w-4" />
																	<span className="sr-only">Edit</span>
																</Button>
																<Button
																	variant="ghost"
																	size="icon"
																	className="text-destructive hover:text-destructive/90"
																	onClick={() => handleDeleteClick(product._id)}
																>
																	<Trash2 className="h-4 w-4" />
																	<span className="sr-only">Delete</span>
																</Button>
															</div>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="add">
					<Card>
						<CardHeader>
							<CardTitle>
								{editingProduct ? "Edit Product" : "Add New Product"}
							</CardTitle>
							<CardDescription>
								{editingProduct
									? "Update the product details"
									: "Add a new product to your store"}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ProductForm
								product={editingProduct || undefined}
								onSubmit={editingProduct ? handleUpdateProduct : handleSubmit}
								onCancel={editingProduct ? handleCancelEdit : undefined}
								isSubmitting={isSubmitting}
							/>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{activeTab === "list" && pagination.pages > 1 && (
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

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							product and remove it from your store.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
