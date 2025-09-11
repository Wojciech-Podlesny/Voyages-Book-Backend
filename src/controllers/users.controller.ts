import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
   res.send('User profile')
}

export const updateUser = async (req: Request, res: Response) => {
   res.send('User profile updated')
}

export const deleteUser = async (req: Request, res: Response) => {
   res.send('User account deleted')
}

export const getUsers = async (req: Request, res: Response) => {
   res.send('List of users')
}

