import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { notAuth } from './handler_error'

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return notAuth("Require Authorization", res)

    const accessToken = token.split(" ")[1]
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        
        if (err) {
            // Kiểm tra xem có phải lỗi hết hạn hay không [00:23:40]
            const isChecked = err instanceof TokenExpiredError
            if (!isChecked) {
                // Lỗi không hợp lệ (sai signature, token lởm...)
                return notAuth('Access Token invalid', res, 1) 
            } else {
                // Lỗi hết hạn - Trả về mã lỗi 2 để Frontend biết mà gọi Refresh Token [00:26:00]
                return notAuth('Access Token expired', res, 2)
            }
        }

        // Nếu không có lỗi, gán user và cho phép đi tiếp
        req.user = user
        next()
    })
}

export default verifyToken