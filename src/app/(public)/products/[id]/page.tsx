import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { IProduct } from "@/models/Product";

export default async function ProductPage({
	params,
}: {
	params: { id: string };
}) {
	// Fetch product data
	const res = await fetch(`http://localhost:3000/api/products/${params.id}`, {
		next: { revalidate: 60 },
	});

	if (!res.ok) {
		console.error("Failed to fetch product. Status:", res.status);
		notFound();
	}

	const responseData = await res.json();
	console.log("API Response:", responseData);

	const product: IProduct = responseData.data;
	console.log("Product Data:", product);

	if (!product) {
		console.error("No product data found in response");
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
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
								unoptimized={true}
							/>
						) : (
							<div className="flex h-full items-center justify-center text-gray-400">
								No image available
							</div>
						)}
					</div>
					{/* Add more image thumbnails here if needed */}
				</div>

				{/* Product Info */}
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold">{product.name}</h1>
						<p className="mt-2 text-2xl font-semibold text-primary">
							{formatPrice(product.price)}
						</p>
					</div>

					<div className="space-y-4">
						<div>
							<h2 className="text-lg font-medium">Description</h2>
							<p className="mt-2 text-gray-600">{product.description}</p>
						</div>

						<div>
							<h2 className="text-lg font-medium">Category</h2>
							<p className="mt-2 text-gray-600">
								{typeof product.category === "string"
									? product.category
									: product.category?.name}
							</p>
						</div>

						<div>
							<h2 className="text-lg font-medium">Availability</h2>
							<p className="mt-2 text-gray-600">
								{product.stock > 0 ? "In Stock" : "Out of Stock"}
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-4">
						<Button size="lg" disabled={product.stock <= 0}>
							{product.stock > 0 ? "Add to Cart" : "Out of Stock"}
						</Button>
					</div>
				</div>
			</div>

			{/* Product Details Tabs */}
			<div className="mt-12">
				<div className="border-b border-gray-200">
					<nav className="flex -mb-px space-x-8">
						<button className="border-b-2 border-primary-500 py-4 px-1 text-sm font-medium text-primary-600">
							Description
						</button>
						<button className="border-transparent border-b-2 py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
							Reviews ({product.reviews?.length || 0})
						</button>
					</nav>
				</div>
				<div className="py-6">
					<p className="text-gray-600">{product.description}</p>
				</div>
			</div>
		</div>
	);
}
