import User from "../models/user.model.js";


export const getUsers = async (req, res, next)=> {
    try {
        const user = await User.find();

        res.status(200).json(user);
    }catch(err){
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if(!user){
            const error = new Error('User does not exist');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: user});
    }catch(err){
        next(err);
    }
}