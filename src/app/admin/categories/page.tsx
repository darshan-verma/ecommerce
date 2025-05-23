"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

interface Category {
	_id: string;
	name: string;
	description?: string;
	isActive: boolean;
	slug: string;
	image?: string;
}

interface CategoryFormData {
	_id?: string;
	name: string;
	description: string;
	image?: File | null;
	imagePreview?: string;
}

export default function AdminCategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
	const [formData, setFormData] = useState<CategoryFormData>({
		_id: "",
		name: "",
		description: "",
		image: null,
		imagePreview: "",
	});
	const [formErrors, setFormErrors] = useState<Partial<CategoryFormData>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const fetchCategories = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/categories");
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to fetch categories");
			}

			setCategories(data.data);
			setError(null);
		} catch (err: any) {
			setError(err.message || "Failed to load categories");
			toast.error("Failed to load categories");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error when user starts typing
		if (formErrors[name as keyof CategoryFormData]) {
			setFormErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setFormData((prev) => ({
				...prev,
				image: file,
				imagePreview: URL.createObjectURL(file),
			}));
		}
	};

	const handleEdit = (category: Category) => {
		setFormData({
			_id: category._id,
			name: category.name,
			description: category.description || "",
			image: null,
			imagePreview: category.image || "",
		});
		setIsEditing(true);
		setIsModalOpen(true);
	};

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this category?")) {
			try {
				const response = await fetch(`/api/categories/${id}`, {
					method: "DELETE",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to delete category");
				}

				toast.success("Category deleted successfully");
				fetchCategories();
			} catch (err: any) {
				console.error("Error deleting category:", err);
				toast.error(err.message || "Failed to delete category");
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form
		const errors: Partial<CategoryFormData> = {};
		if (!formData.name.trim()) {
			errors.name = "Category name is required";
		}

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			return;
		}

		try {
			setIsSubmitting(true);
			const formDataToSend = new FormData();
			formDataToSend.append("name", formData.name.trim());
			formDataToSend.append("description", formData.description.trim());

			if (formData.image) {
				formDataToSend.append("image", formData.image);
			}

			const url =
				isEditing && formData._id
					? `/api/categories/${formData._id}`
					: "/api/categories";

			const method = isEditing ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				body: formDataToSend,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to save category");
			}

			toast.success(
				isEditing
					? "Category updated successfully"
					: "Category created successfully"
			);

			// Reset form and close modal
			setFormData({
				_id: "",
				name: "",
				description: "",
				image: null,
				imagePreview: "",
			});
			setIsEditing(false);
			setIsModalOpen(false);
			fetchCategories();
		} catch (err: any) {
			console.error("Error saving category:", err);
			toast.error(err.message || "Failed to save category");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCloseModal = () => {
		setFormData({
			_id: "",
			name: "",
			description: "",
			image: null,
			imagePreview: "",
		});
		setIsEditing(false);
		setIsModalOpen(false);
		setFormErrors({});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>
				<button
					onClick={() => setIsModalOpen(true)}
					className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
				>
					<FiPlus className="mr-2" />
					Add Category
				</button>
			</div>

			{error && (
				<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
					<div className="flex">
						<div className="flex-shrink-0">
							<FiX className="h-5 w-5 text-red-500" />
						</div>
						<div className="ml-3">
							<p className="text-sm text-red-700">{error}</p>
						</div>
					</div>
				</div>
			)}

			<div className="bg-white shadow overflow-hidden sm:rounded-lg">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Name
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Description
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Status
								</th>
								<th scope="col" className="relative px-6 py-3">
									<span className="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{categories.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
									>
										No categories found. Add your first category to get started.
									</td>
								</tr>
							) : (
								categories.map((category) => (
									<tr key={category._id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												{category.image ? (
													<div className="flex-shrink-0 h-10 w-10">
														{(() => {
															console.log("Category image debug:", {
																categoryName: category.name,
																originalPath: category.image,
																extractedFilename: category.image
																	.split("/")
																	.pop(),
																constructedPath: `/uploads/categories/${category.image
																	.split("/")
																	.pop()}`,
															});
															return null;
														})()}
														<div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
															<img
																className="h-full w-full object-cover"
																src={`/uploads/categories/${category.image
																	.split("/")
																	.pop()}`}
																alt={category.name}
																onError={(e) => {
																	console.error("Image load error:", {
																		error: "Failed to load image",
																		src: e.currentTarget.src,
																		category: category.name,
																		fullPath:
																			window.location.origin +
																			e.currentTarget.src,
																	});
																	e.currentTarget.onerror = null;
																	e.currentTarget.src =
																		"/placeholder-category.png";
																}}
																onLoad={() =>
																	console.log(
																		"Image loaded successfully:",
																		category.name
																	)
																}
															/>
														</div>
													</div>
												) : (
													<div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
														<span className="text-gray-500 text-xs">
															No Image
														</span>
													</div>
												)}
												<div className={`ml-${category.image ? "4" : "0"}`}>
													<div className="text-sm font-medium text-gray-900">
														{category.name}
													</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-normal">
											<div className="text-sm text-gray-900">
												{category.description || "No description"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													category.isActive
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{category.isActive ? "Active" : "Inactive"}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button
												onClick={() => handleEdit(category)}
												className="text-indigo-600 hover:text-indigo-900 mr-4"
											>
												<FiEdit2 className="h-5 w-5" />
											</button>
											<button
												onClick={() => handleDelete(category._id)}
												className="text-red-600 hover:text-red-900"
											>
												<FiTrash2 className="h-5 w-5" />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="fixed inset-0 bg-black/30 backdrop-blur-sm"
						onClick={() => !isSubmitting && handleCloseModal()}
					/>
					<div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
						<div className="p-6">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold">
									{isEditing ? "Edit Category" : "Add New Category"}
								</h2>
								<button
									type="button"
									onClick={() => !isSubmitting && handleCloseModal()}
									className="text-gray-500 hover:text-gray-700"
									disabled={isSubmitting}
								>
									<FiX className="w-6 h-6" />
								</button>
							</div>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Category Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										className={`w-full px-3 py-2 border ${
											formErrors.name ? "border-red-500" : "border-gray-300"
										} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
										disabled={isSubmitting}
										placeholder="e.g., Electronics, Clothing"
									/>
									{formErrors.name && (
										<p className="mt-1 text-sm text-red-600">
											{formErrors.name}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="description"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Description
									</label>
									<textarea
										id="description"
										name="description"
										rows={3}
										value={formData.description}
										onChange={handleInputChange}
										className={`w-full px-3 py-2 border ${
											formErrors.description
												? "border-red-500"
												: "border-gray-300"
										} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
										disabled={isSubmitting}
										placeholder="Optional category description"
									/>
									{formErrors.description && (
										<p className="mt-1 text-sm text-red-600">
											{formErrors.description}
										</p>
									)}
								</div>
								<div className="space-y-4">
									<div>
										<label
											htmlFor="image"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Category Image
										</label>
										<div className="mt-1 flex items-center">
											<label
												htmlFor="image-upload"
												className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
											>
												Choose File
											</label>
											<input
												id="image-upload"
												name="image"
												type="file"
												accept="image/*"
												onChange={handleImageChange}
												className="sr-only"
												disabled={isSubmitting}
											/>
											{formData.image && (
												<span className="ml-2 text-sm text-gray-500">
													{formData.image.name}
												</span>
											)}
										</div>
										{formData.imagePreview && (
											<div className="mt-2">
												<img
													src={formData.imagePreview}
													alt="Preview"
													className="h-32 w-32 object-cover rounded-md"
												/>
											</div>
										)}
									</div>
								</div>
								<div className="flex justify-end space-x-3 pt-2">
									<button
										type="button"
										onClick={() => !isSubmitting && handleCloseModal()}
										className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={isSubmitting}
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={isSubmitting}
										className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isSubmitting ? (
											<span className="flex items-center">
												<svg
													className="w-4 h-4 mr-2 animate-spin"
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
											</span>
										) : isEditing ? (
											"Update Category"
										) : (
											"Save Category"
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{isDeleting && (
				<div className="fixed z-10 inset-0 overflow-y-auto">
					<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div
							className="fixed inset-0 transition-opacity"
							aria-hidden="true"
						>
							<div className="absolute inset-0 bg-gray-200 opacity-30"></div>
						</div>
						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						>
							&#8203;
						</span>
						<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
							<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<div className="sm:flex sm:items-start">
									<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
										<FiTrash2 className="h-6 w-6 text-red-600" />
									</div>
									<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3 className="text-lg leading-6 font-medium text-gray-900">
											Delete Category
										</h3>
										<div className="mt-2">
											<p className="text-sm text-gray-500">
												Are you sure you want to delete this category? This
												action cannot be undone.
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									onClick={() => {
										setIsDeleting(false);
										setCategoryToDelete(null);
									}}
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
