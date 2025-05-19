"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

// Define Category type
interface Category {
	_id: string;
	name: string;
	slug: string;
}

// Define form schema
const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	description: z.string().min(10, {
		message: "Description must be at least 10 characters.",
	}),
	price: z.coerce.number().min(0.01, {
		message: "Price must be greater than 0.",
	}),
	category: z.string().min(1, {
		message: "Please select a category.",
	}),
	stock: z.coerce.number().int().min(0, {
		message: "Stock must be a non-negative integer.",
	}),
	imageUrl: z.string().url({
		message: "Please enter a valid URL.",
	}),
});

// Categories from the Product model
const categories = [
	{ id: "Electronics", name: "Electronics" },
	{ id: "Cameras", name: "Cameras" },
	{ id: "Laptops", name: "Laptops" },
	{ id: "Accessories", name: "Accessories" },
	{ id: "Headphones", name: "Headphones" },
	{ id: "Food", name: "Food" },
	{ id: "Books", name: "Books" },
	{ id: "Clothes/Shoes", name: "Clothes/Shoes" },
	{ id: "Beauty/Health", name: "Beauty/Health" },
	{ id: "Sports", name: "Sports" },
	{ id: "Outdoor", name: "Outdoor" },
	{ id: "Home", name: "Home" },
];

type ProductFormValues = z.infer<typeof formSchema>;

// Default values for new product
const defaultValues: Partial<ProductFormValues> = {
	name: "",
	description: "",
	price: 0,
	stock: 0,
	imageUrl: "",
};

// In ProductForm component, update the form's onSubmit handler:

interface ProductFormProps {
	product?: ProductFormValues & { id?: string };
	onSubmit: (data: ProductFormValues) => Promise<void>;
	isSubmitting?: boolean;
}

export function ProductForm({
	product,
	onSubmit,
	isSubmitting = false,
}: ProductFormProps) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	// Fetch categories on component mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setIsLoading(true);
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
					description: "Failed to load categories. Please try again.",
					// variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchCategories();
	}, []);

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: product || defaultValues,
	});

	const handleFormSubmit = async (data: ProductFormValues) => {
		try {
			await onSubmit(data);
			form.reset(defaultValues);
			toast({
				title: "Success",
				description: "Product saved successfully!",
			});
		} catch (error) {
			console.error("Error saving product:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to save product",
				// variant: "destructive",
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleFormSubmit)}
				className="space-y-6"
			>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter product name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a category" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category._id} value={category._id}>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Price ($)</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										placeholder="0.00"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="stock"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Stock</FormLabel>
								<FormControl>
									<Input type="number" placeholder="0" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Image URL</FormLabel>
								<FormControl>
									<Input
										placeholder="https://example.com/image.jpg"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Enter the URL of the product image
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Enter product description"
										className="min-h-[120px]"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end space-x-4">
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full sm:w-auto"
					>
						{isSubmitting ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Saving...
							</>
						) : (
							"Save Product"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
