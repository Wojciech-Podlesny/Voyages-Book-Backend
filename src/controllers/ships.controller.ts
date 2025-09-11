import {Response,Request} from 'express'

export const getShips = async (req: Request, res: Response) => {
   res.send('List of ships')
}

export const getShip = async (req: Request, res: Response) => {
   res.send('Ship details')
}

export const createShip = async (req: Request, res: Response) => {
   res.send('Ship created')
}

export const updateShip = async (req: Request, res: Response) => {
   res.send('Ship updated')
}

export const deleteShip = async (req: Request, res: Response) => {
   res.send('Ship deleted')
}