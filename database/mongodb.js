import {DB_URI} from "../config/env.js";
import mongoose from "mongoose";


if(!DB_URI) {
    throw new Error(`Please define db url`)
}

const connectToDb = async ()=> {
    try {
    await mongoose.connect(DB_URI);
    console.log("Connected");
    }catch(err){
        console.log("MongoDB connection error:", err)
        process.exit(1);
    }
}

export default connectToDb;