import * as controllers from '../controllers'
import express from 'express'

const router = express.Router()

router.post('/register', controllers.register)
router.post('/login', controllers.login)
// Sửa authController thành controllers
router.post('/refresh-token', controllers.refreshToken) 

export default router