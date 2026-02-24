import { notAuth } from "./handler_error"

export const isAdmin = (req, res, next) => {
    // Sửa role_code thành role
    const { role } = req.user 
    if (role !== 'R1') return notAuth('Require role Admin', res)

    next()
}

export const isModeratorOrAdmin = (req, res, next) => {
    const { role } = req.user
    if (role !== 'R1' && role !== 'R2') return notAuth('Require role Admin/Moderator', res)

    next()
}