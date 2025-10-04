import { Router } from "express";
import { createShip, deleteShip, getShip, getShips, updateShip } from "../controllers/ships.controller";

const shipsRouter = Router();

shipsRouter.get("/", getShips);
shipsRouter.get("/:id", getShip); 
shipsRouter.post("/", createShip);
shipsRouter.put("/:id", updateShip);
shipsRouter.delete("/:id", deleteShip);

export default shipsRouter;