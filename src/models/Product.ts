import mongoose from "mongoose";

export interface IProduct extends Document {
	name: string;
	description: string;
	price: number;
	category: string;
	stock: number;
	rating: number;
	reviews: {
		user: mongoose.Schema.Types.ObjectId;
		rating: number;
		comment: string;
	}[];
	createdAt: Date;
	updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
	{
		name: {
			type: String,
			required: [true, "Please enter product name"],
			trim: true,
			maxlength: [100, "Product name cannot exceed 100 characters"],
		},
		description: {
			type: String,
			required: [true, "Please enter product description"],
			trim: true,
		},
		price: {
			type: Number,
			required: [true, "Please enter product price"],
			maxlength: [8, "Product price cannot exceed 8 characters"],
			default: 0.0,
		},
		images: [
			{
				public_id: {
					type: String,
					required: true,
				},
				url: {
					type: String,
					required: true,
				},
			},
		],
		category: {
			type: String,
			required: [true, "Please enter product category"],
			enum: {
				values: [
					"Electronics",
					"Cameras",
					"Laptops",
					"Accessories",
					"Headphones",
					"Food",
					"Books",
					"Clothes/Shoes",
					"Beauty/Health",
					"Sports",
					"Outdoor",
					"Home",
				],
				message: "Please select a valid category",
			},
		},
		stock: {
			type: Number,
			required: [true, "Please enter product stock"],
			maxlength: [5, "Product stock cannot exceed 5 characters"],
			default: 0,
		},
		rating: {
			type: Number,
			default: 0,
		},
		reviews: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				name: {
					type: String,
					required: true,
				},
				rating: {
					type: Number,
					required: true,
				},
				comment: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Product ||
	mongoose.model<IProduct>("Product", productSchema);
