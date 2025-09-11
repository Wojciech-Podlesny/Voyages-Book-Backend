import { Router } from "express";
import { deleteUser, getUser, updateUser } from "../controllers/users.controller";

const usersRouter = Router();

usersRouter.get('/:id', getUser);
usersRouter.put('/:id', updateUser);
usersRouter.delete('/:id', deleteUser);

export default usersRouter;
