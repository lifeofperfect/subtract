import Subscription from "../models/subscription.model.js";

export const createSubscription =async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        res.status(201).json({success: true, message: "Subscription created", data: subscription});
    }catch (err){
    next(err);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // A signed in user may only read their own subscriptions.
        if(req.user.id !== req.params.id){
            const error = new Error('You are not the owner of this account');
            error.statusCode = 403;
            throw error;
        }

        const subscriptions = await Subscription.find({user: req.params.id});

        res.status(200).json({success: true, data: subscriptions});
    }catch (err){
        next(err);
    }
}
