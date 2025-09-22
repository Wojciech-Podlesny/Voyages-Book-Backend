import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/users.controller";

const usersRouter = Router();

usersRouter.get('/:id', getUser);
usersRouter.put('/:id', updateUser);
usersRouter.delete('/:id', deleteUser);
usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);

export default usersRouter;
