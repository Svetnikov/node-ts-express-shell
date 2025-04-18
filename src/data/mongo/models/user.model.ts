import mongoose from "mongoose"


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, 'Name is required.']
        },
        email: {
            type: String,
            require: [true, 'Email is required.']
        },
        emailValidated: {
            type: Boolean,
            default: false,
          },
        password: {
            type: String,
            required: [ true, 'Password is required' ]
        },
            img: {
            type: String,
        },
        role: {
            type: [String],
            default: ['USER_ROLE'],
            enum: ['ADMIN_ROLE','USER_ROLE']
        }
    }
) 

export const UserModel = mongoose.model('User', userSchema)