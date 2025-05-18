import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
	_id: string;
	name: string;
	description: string;
	price: number;
	images: Array<{
		public_id: string;
		url: string;
	}>;
	category: string;
	stock: number;
	ratings: number;
	reviews: Array<{
		user: mongoose.Schema.Types.ObjectId;
		name: string;
		rating: number;
		comment: string;
	}>;
	createdAt: Date;
	updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
		images: [
			{
				public_id: { type: String, required: true },
				url: { type: String, required: true },
			},
		],
		category: { type: String, required: true },
		stock: { type: Number, required: true, default: 0, min: 0 },
		ratings: { type: Number, default: 0 },
		reviews: [
			{
				user: { type: Schema.Types.ObjectId, ref: "User", required: true },
				name: { type: String, required: true },
				rating: { type: Number, required: true },
				comment: { type: String, required: true },
			},
		],
	},
	{ timestamps: true }
);

// Create and export the model
export default mongoose.models.Product ||
	mongoose.model<IProduct>("Product", productSchema);
