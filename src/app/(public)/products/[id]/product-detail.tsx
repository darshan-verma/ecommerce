"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Star,

	Truck,
	Shield,

	ArrowLeft,
	Minus,
	Plus,
	Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";

interface Product {
	_id: string;
	name: string;
	price: number;
	description: string;
	images: { url: string; public_id?: string }[];
	category: string | { _id: string; name: string };
	stock: number;
	ratings?: number;
	reviews?: Array<{
		user: string;
		name: string;
		rating: number;
		comment: string;
	}>;
	createdAt: string;
	updatedAt: string;
}

export function ProductDetail() {
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(0);

	const router = useRouter();
	const { id } = useParams();
	const { addToCart } = useCart();

	useEffect(() => {
		const fetchProduct = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const response = await fetch(`/api/products/${id}`);

				if (!response.ok) {
					throw new Error("Failed to fetch product");
				}

				const { data } = await response.json();
				setProduct(data);
			} catch (err) {
				console.error("Error fetching product:", err);
				setError("Failed to load product. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<p className="text-red-500">{error}</p>
				<Button onClick={() => router.back()} className="mt-4">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Products
				</Button>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="text-center py-12">
				<p>Product not found</p>
				<Button onClick={() => router.push("/products")} className="mt-4">
					Browse Products
				</Button>
			</div>
		);
	}

	const categoryName =
		typeof product.category === "string"
			? product.category
			: product.category?.name;

	return (
		<div className="container mx-auto px-4 py-8">
			<Button variant="ghost" onClick={() => router.back()} className="mb-6">
				<ArrowLeft className="mr-2 h-4 w-4" />
				Back to Products
			</Button>

			<div className="grid md:grid-cols-2 gap-8">
				{/* Product Images */}
				<div className="space-y-4">
					<div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
						{product.images?.[0]?.url ? (
							<Image
								src={product.images[0].url}
								alt={product.name}
								fill
								className="object-cover"
								priority
							/>
						) : (
							<div className="flex h-full items-center justify-center text-gray-400">
								No image available
							</div>
						)}
					</div>
					<div className="grid grid-cols-4 gap-2">
						{product.images?.map((image, index) => (
							<button
								key={index}
								onClick={() => setSelectedImage(index)}
								className={`relative aspect-square overflow-hidden rounded-md ${
									selectedImage === index ? "ring-2 ring-primary" : ""
								}`}
							>
								<Image
									src={image.url}
									alt={`${product.name} - ${index + 1}`}
									fill
									className="object-cover"
								/>
							</button>
						))}
					</div>
				</div>

				{/* Product Info */}
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold">{product.name}</h1>
						<div className="mt-2 flex items-center gap-2">
							{product.ratings && (
								<div className="flex items-center">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={`h-4 w-4 ${
												star <= Math.round(product.ratings || 0)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
									<span className="ml-2 text-sm text-gray-600">
										{product.ratings.toFixed(1)} ({product.reviews?.length || 0}{" "}
										reviews)
									</span>
								</div>
							)}
						</div>
						<p className="mt-4 text-2xl font-semibold text-primary">
							{formatPrice(product.price)}
						</p>
					</div>

					<div className="space-y-4">
						<div>
							<h2 className="text-lg font-medium">Description</h2>
							<p className="mt-2 text-gray-600">{product.description}</p>
						</div>

						{categoryName && (
							<div>
								<h2 className="text-lg font-medium">Category</h2>
								<p className="mt-2 text-gray-600">{categoryName}</p>
							</div>
						)}

						<div>
							<h2 className="text-lg font-medium">Availability</h2>
							<p className="mt-2 text-gray-600">
								{product.stock > 0 ? "In Stock" : "Out of Stock"}
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-4">
						<div className="flex items-center border rounded-md">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setQuantity(Math.max(1, quantity - 1))}
								className="h-8 w-8 p-0"
							>
								<Minus className="h-4 w-4" />
							</Button>
							<span className="w-8 text-center">{quantity}</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setQuantity(quantity + 1)}
								className="h-8 w-8 p-0"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
						<Button
							size="lg"
							disabled={product.stock <= 0}
							onClick={() => {
								if (product) {
									addToCart({
										id: Number(product._id),
										name: product.name,
										price: product.price,
										image: product.images?.[0]?.url || "",
										color: "default",
									});
								}
							}}
						>
							{product.stock > 0 ? "Add to Cart" : "Out of Stock"}
						</Button>
					</div>

					<div className="flex items-center space-x-4 pt-4 border-t">
						<div className="flex items-center text-sm text-gray-600">
							<Truck className="mr-2 h-5 w-5" />
							<span>Free shipping on orders over $50</span>
						</div>
						<div className="flex items-center text-sm text-gray-600">
							<Shield className="mr-2 h-5 w-5" />
							<span>2-year warranty</span>
						</div>
					</div>
				</div>
			</div>

			{/* Product Details Tabs */}
			<div className="mt-12">
				<Tabs defaultValue="description" className="w-full">
					<TabsList className="grid w-full grid-cols-2 max-w-md">
						<TabsTrigger value="description">Description</TabsTrigger>
						<TabsTrigger value="reviews">
							Reviews ({product.reviews?.length || 0})
						</TabsTrigger>
					</TabsList>
					<TabsContent value="description" className="mt-6">
						<div className="prose max-w-none">
							<p>{product.description}</p>
						</div>
					</TabsContent>
					<TabsContent value="reviews" className="mt-6">
						{product.reviews?.length ? (
							<div className="space-y-6">
								{product.reviews.map((review, index) => (
									<div key={index} className="border-b pb-4">
										<div className="flex items-center justify-between">
											<div>
												<h4 className="font-medium">{review.name}</h4>
												<div className="flex items-center mt-1">
													{[1, 2, 3, 4, 5].map((star) => (
														<Star
															key={star}
															className={`h-4 w-4 ${
																star <= review.rating
																	? "fill-yellow-400 text-yellow-400"
																	: "text-gray-300"
															}`}
														/>
													))}
												</div>
											</div>
											<span className="text-sm text-gray-500">
												{new Date(product.updatedAt).toLocaleDateString()}
											</span>
										</div>
										<p className="mt-2 text-gray-600">{review.comment}</p>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-600">
								No reviews yet. Be the first to review this product!
							</p>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
