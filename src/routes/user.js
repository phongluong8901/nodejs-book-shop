import * as controllers from '../controllers'
import express from 'express'
import verifyToken from '../middlewares/verify_token'
import { isAdmin, isModeratorOrAdmin } from '../middlewares/verify_roles'

const router = express.Router()
//Public  Routes

// Middleware Auth
router.use(verifyToken)
// router.use(isAdmin)

//Private Routes
// router.get('/', [verifyToken, isAdmin], controllers.getCurrent)
router.get('/', controllers.getCurrent)

module.exports = router