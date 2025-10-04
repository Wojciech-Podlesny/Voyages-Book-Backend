import { body } from "express-validator";

export const signUpValidator = [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('name').notEmpty().isLength({ min: 2, max: 10}).withMessage('Name must be between 2 and 100 characters long')

]; 

export const signInValidator = [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail()
];


export const resetPasswordValidator = [
    body("password").isStrongPassword({ minLength: 8, minNumbers: 1, minLowercase: 1, minUppercase: 1, minSymbols: 0 })
    .withMessage("Password too weak"),
];


export const changePasswordValidator = [
body("currentPassword").isString().isLength({ min: 1 }),
body("newPassword")
.isStrongPassword({ minLength: 8, minNumbers: 1, minLowercase: 1, minUppercase: 1, minSymbols: 0 })
.withMessage("Password too weak"),
];