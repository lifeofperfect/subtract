import {Router} from "express";
import {getUser, getUsers} from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.get('/', getUsers);

userRoutes.get('/:id', getUser);

userRoutes.post('/', (req, res) => res.send({title:"Create users"}));

userRoutes.put('/:id', (req, res) => res.send({title:"update users"}));

userRoutes.delete('/:id', (req, res) => res.send({title:"delete all users"}));


export default userRoutes;