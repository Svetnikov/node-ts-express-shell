import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
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
        description: {
            type: String,
            
            // ref: 'User',
            // require: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    }
)

productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret, options) {
        delete ret._id,
        delete ret.password
    },
})

export const ProductModel = mongoose.model('Product', productSchema)