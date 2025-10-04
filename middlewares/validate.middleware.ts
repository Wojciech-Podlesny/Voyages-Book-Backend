import {Request, Response, NextFunction} from 'express';
import { validationResult } from 'express-validator';

const validate = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success:false, errors: errors.array({onlyFirstError: true}) });
    }
    next();
}

export default validate;