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

categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret, options) {
        delete ret._id
    },
})

export const CategoryModel = mongoose.model('Category', categorySchema)