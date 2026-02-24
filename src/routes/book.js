import * as controllers from '../controllers'
import express from 'express'
import verifyToken from '../middlewares/verify_token'
import { isAdmin, isModeratorOrAdmin } from '../middlewares/verify_roles'
import uploadCloud from '../middlewares/uploader'

const router = express.Router()

router.get('/', controllers.getBooks)

router.use(verifyToken)
router.use(isAdmin)
router.post('/', uploadCloud.single('image'), controllers.creatNewBook)
// Cập nhật sách (có thể có ảnh hoặc không)
router.put('/', uploadCloud.single('image'), controllers.updateBook);

// Xóa sách (truyền id qua query params)
router.delete('/', controllers.deleteBook);

module.exports = router