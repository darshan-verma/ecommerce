"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
	PackageSearch,
	PackagePlus,
	Search,
	Loader2,
	Plus,
	Minus,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Product {
	_id: string;
	name: string;
	price: number;
	stock: number;
	images: { url: string }[];
	category: { name: string } | string;
}

const getImageUrl = (imageUrl: string | undefined) => {
	if (!imageUrl) return "/placeholder-product.png";
	return imageUrl.startsWith("http")
		? imageUrl
		: `/uploads/products/${imageUrl}`;
};

export default function InventoryPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState<Record<string, boolean>>({});
	const [searchTerm, setSearchTerm] = useState("");
	const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});

	useEffect(() => {
		fetchInventory();
	}, []);

	const fetchInventory = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/inventory");
			if (!response.ok) throw new Error("Failed to fetch inventory");
			const data = await response.json();
			setProducts(data);
		} catch (error) {
			console.error("Error fetching inventory:", error);
			toast.error("Failed to load inventory");
		} finally {
			setLoading(false);
		}
	};

	const updateStock = async (productId: string, change: number) => {
		try {
			setUpdating((prev) => ({ ...prev, [productId]: true }));

			const response = await fetch("/api/inventory", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, quantity: change }),
			});

			if (!response.ok) throw new Error("Failed to update stock");

			// Update local state
			setProducts((prev) =>
				prev.map((p) =>
					p._id === productId ? { ...p, stock: p.stock + change } : p
				)
			);

			toast.success("Stock updated successfully");
		} catch (error) {
			console.error("Error updating stock:", error);
			toast.error("Failed to update stock");
		} finally {
			setUpdating((prev) => ({ ...prev, [productId]: false }));
		}
	};

	const {
		filteredProducts,
		lowStockProducts,
		outOfStockProducts,
		inStockProducts,
	} = useMemo(() => {
		const filtered = products.filter(
			(product) =>
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(typeof product.category === "object" &&
					product.category?.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()))
		);

		return {
			filteredProducts: filtered,
			lowStockProducts: filtered.filter((p) => p.stock > 0 && p.stock <= 10),
			outOfStockProducts: filtered.filter((p) => p.stock === 0),
			inStockProducts: filtered.filter((p) => p.stock > 10),
		};
	}, [products, searchTerm]);

	const handleImageError = useCallback(
		(e: React.SyntheticEvent<HTMLImageElement>) => {
			const target = e.target as HTMLImageElement;
			if (!target.src.endsWith("/placeholder-product.png")) {
				target.src = "/placeholder-product.png";
			} else {
				target.onerror = null;
				target.style.display = "none";
			}
		},
		[]
	);

	const renderProductRow = useCallback(
		(product: Product) => (
			<TableRow key={product._id}>
				<TableCell className="flex items-center space-x-4">
					<div className="h-10 w-10 relative rounded-md overflow-hidden">
						<img
							src={getImageUrl(product.images?.[0]?.url)}
							alt={product.name}
							className="h-full w-full object-cover"
							onError={handleImageError}
							loading="lazy"
						/>
					</div>
					<div>
						<div className="font-medium">{product.name}</div>
						<div className="text-sm text-gray-500">
							{typeof product.category === "object"
								? product.category?.name
								: "Uncategorized"}
						</div>
					</div>
				</TableCell>
				<TableCell className="text-right">
					${product.price.toFixed(2)}
				</TableCell>
				<TableCell
					className={`text-right font-medium ${
						product.stock === 0
							? "text-red-600"
							: product.stock <= 10
							? "text-amber-600"
							: "text-green-600"
					}`}
				>
					{product.stock} in stock
				</TableCell>
				<TableCell className="flex justify-end space-x-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => updateStock(product._id, -1)}
						disabled={updating[product._id] || product.stock <= 0}
					>
						{updating[product._id] ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Minus className="h-4 w-4" />
						)}
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => updateStock(product._id, 1)}
						disabled={updating[product._id]}
					>
						{updating[product._id] ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Plus className="h-4 w-4" />
						)}
					</Button>
				</TableCell>
			</TableRow>
		),
		[handleImageError, updating]
	);

	const renderInventoryTable = (items: Product[], emptyMessage: string) => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Product</TableHead>
					<TableHead className="text-right">Price</TableHead>
					<TableHead className="text-right">Stock</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.length > 0 ? (
					items.map(renderProductRow)
				) : (
					<TableRow>
						<TableCell colSpan={4} className="h-24 text-center">
							{emptyMessage}
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Inventory Management
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage your product inventory and stock levels
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							type="search"
							placeholder="Search products..."
							className="pl-9 w-full md:w-[300px]"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Tabs defaultValue="all" className="space-y-4">
				<TabsList>
					<TabsTrigger value="all">All Products</TabsTrigger>
					<TabsTrigger value="low-stock">Low Stock</TabsTrigger>
					<TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<CardTitle>All Products</CardTitle>
									<CardDescription>
										View and manage all products in your inventory
									</CardDescription>
								</div>
								<div className="flex items-center gap-2">
									<Button variant="outline" size="sm">
										Export
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							{renderInventoryTable(
								[
									...inStockProducts,
									...lowStockProducts,
									...outOfStockProducts,
								],
								"No products found. Add some products to get started."
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="low-stock">
					<Card>
						<CardHeader>
							<CardTitle>Low Stock Items</CardTitle>
							<CardDescription>
								Products that are running low on inventory (10 or fewer items in
								stock)
							</CardDescription>
						</CardHeader>
						<CardContent>
							{renderInventoryTable(
								lowStockProducts,
								"No low stock items. All your products have sufficient stock."
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="out-of-stock">
					<Card>
						<CardHeader>
							<CardTitle>Out of Stock Items</CardTitle>
							<CardDescription>
								Products that are currently out of stock
							</CardDescription>
						</CardHeader>
						<CardContent>
							{renderInventoryTable(
								outOfStockProducts,
								"No out of stock items. All your products are in stock."
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
