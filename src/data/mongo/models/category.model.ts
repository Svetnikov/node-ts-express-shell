import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: true
        },
        available: {
            type: Boolean,
            default: false
        },
        price: {
            type: Number,
            default: 0
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
)

export const CategoryModel = mongoose.model('Category', categorySchema)