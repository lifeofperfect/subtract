import {Router} from "express";

const userRoutes = Router();

userRoutes.get('/', (req, res) => res.send({title:"Get all users"}));

userRoutes.get('/:id', (req, res) => res.send({title:"Get single users"}));

userRoutes.post('/', (req, res) => res.send({title:"Create users"}));

userRoutes.put('/:id', (req, res) => res.send({title:"update users"}));

userRoutes.delete('/:id', (req, res) => res.send({title:"delete all users"}));


export default userRoutes;