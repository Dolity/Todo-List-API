const express = require('express')
const { query, body, validationResult } = require('express-validator')

const userRouter = express.Router()

const userController = require('../controller/userController')

const validateInputs = [
    body('username')
      .trim() 
      .isLength({ min: 4, max: 20 })
      .withMessage('Username must be between 4 and 20 characters')
      .bail(),
  
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters')
      .bail(),
  
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];

userRouter.get('/health', userController.userHealth)
userRouter.post('/register', validateInputs, userController.userRegister)
userRouter.post('/login', userController.userLogin)
userRouter.post('/logout', userController.userLogout)
userRouter.post('/token', userController.userRefreshToken)

module.exports = userRouter