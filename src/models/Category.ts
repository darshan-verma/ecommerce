import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
	name: string;
	description?: string;
	slug: string;
	image?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
	{
		name: {
			type: String,
			required: [true, "Please enter category name"],
			trim: true,
			unique: true,
			maxlength: [100, "Category name cannot exceed 100 characters"],
		},
		description: {
			type: String,
			trim: true,
			maxlength: [500, "Description cannot exceed 500 characters"],
		},
		image: {
			type: String,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

// Create slug from name before saving
categorySchema.pre<ICategory>("save", function (next) {
	this.slug = this.name
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "");
	next();
});

// Prevent duplicate key error when creating a new category with same name
categorySchema.index({ name: 1 }, { unique: true });
categorySchema.index({ slug: 1 }, { unique: true });

const Category =
	mongoose.models.Category ||
	mongoose.model<ICategory>("Category", categorySchema);

export default Category;
