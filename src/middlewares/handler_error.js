import createError from 'http-errors'

export const badRequest = (err, res) => {
    const error = createError.BadRequest(err) // Hoặc truyền message lỗi vào đây
    return res.status(400).json({ // BadRequest thường là code 400
        err: 1,
        mes: err // Trả về thông báo lỗi cụ thể
    })
}

export const internalServerError = (res) => {
    const error = createError.InternalServerError()
    return res.status(500).json({ // Đổi err.status thành 500 hoặc error.status
        err: 1,
        mes: error.message
    })
}

// Thêm hàm này để xử lý lỗi 404 (Route không tồn tại)
export const notFound = (req, res) => {
    const error = createError.NotFound('This routes is not defined')
    return res.status(error.status).json({
        err: 1,
        mes: error.message
    })
}

export const notAuth = (err, res, isExpired) => {
    const error = createError.Unauthorized(err)
    return res.status(error.status).json({
        // Nếu isExpired truyền vào là true, trả về 2, ngược lại trả về 1 [00:26:00]
        err: isExpired ? 2 : 1, 
        mes: error.message
    })
}