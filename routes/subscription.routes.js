import {Router} from "express";


const subscriptionRoutes = Router();

subscriptionRoutes.get('/', (req, res) => res.send({title: "get all subscriptions"}));

subscriptionRoutes.post('/', (req, res) => res.send({title: "create subscriptions"}));

subscriptionRoutes.get('/:id', (req, res) => res.send({title: "create single subscription"}));


subscriptionRoutes.put('/:id', (req, res) => res.send({title: "update subscriptions"}));


subscriptionRoutes.delete('/:id', (req, res) => res.send({title: "delete subscriptions"}));


subscriptionRoutes.get('/user/:id', (req, res) => res.send({title: "create subscriptions"}));

subscriptionRoutes.put('/:id/cancel', (req, res) => res.send({title: "cancel subscriptions"}));

subscriptionRoutes.post('/upcomming-renewals', (req, res) => res.send({title: "get coming renewals subscriptions"}));




export default subscriptionRoutes;
