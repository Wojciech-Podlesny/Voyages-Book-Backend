import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/users.controller";
import authorize from "../middlewares/auth.middleware";

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', authorize, getUser);
usersRouter.put('/:id', updateUser);
usersRouter.delete('/:id', deleteUser);
usersRouter.post('/', createUser);


export default usersRouter;
