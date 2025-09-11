import { Request, Response } from 'express'

export const getVoyages = async (req: Request, res: Response) => {
   res.send('List of voyages')
}

export const getVoyage = async (req: Request, res: Response) => {
   res.send('Voyage details')
}

export const createVoyage = async (req: Request, res: Response) => {
   res.send('Voyage created')
}

export const updateVoyage = async (req: Request, res: Response) => {
   res.send('Voyage updated')
}

export const deleteVoyage = async (req: Request, res: Response) => {
   res.send('Voyage deleted')
}