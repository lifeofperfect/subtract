import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js";
import {createSubscription, getUserSubscriptions} from "../controllers/subscription.controller.js";


const subscriptionRoutes = Router();

subscriptionRoutes.get('/', (req, res) => res.send({title: "get all subscriptions"}));

subscriptionRoutes.post('/', authorize, createSubscription);

subscriptionRoutes.get('/:id', (req, res) => res.send({title: "create single subscription"}));


subscriptionRoutes.put('/:id', (req, res) => res.send({title: "update subscriptions"}));


subscriptionRoutes.delete('/:id', (req, res) => res.send({title: "delete subscriptions"}));


subscriptionRoutes.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRoutes.put('/:id/cancel', (req, res) => res.send({title: "cancel subscriptions"}));

subscriptionRoutes.post('/upcomming-renewals', (req, res) => res.send({title: "get coming renewals subscriptions"}));




export default subscriptionRoutes;
