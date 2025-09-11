import { Router } from "express"
import { createVoyage, deleteVoyage, getVoyage, getVoyages, updateVoyage } from "../controllers/voyages.controller"

const voyagesRouter = Router()

voyagesRouter.get('/', getVoyages)
voyagesRouter.get('/:id', getVoyage)
voyagesRouter.post('/', createVoyage)
voyagesRouter.put('/:id', updateVoyage)
voyagesRouter.delete('/:id', deleteVoyage)

export default voyagesRouter