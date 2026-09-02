import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+/, "Please enter a valid email address."],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 5,
    }
}, {timestamps: true});


const User = mongoose.model("User", userSchema);

export default User;