import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES, JWT_SECRET} from "../config/env.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res, next)=> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name, email, password:hashedPassword}], {session});

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES});
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User successfully signed up',
            data: {
                token,
                user:newUsers[0]
            }
        })
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
}

export const signIn = async (req, res, next) => {}

export const signOut = async (req, res, next) => {}