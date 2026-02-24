import db from '../models'

export const getOne = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { id: userId },
            attributes: { exclude: ['password', 'role_code'] }, // Không trả về mật khẩu
            include: [
                {model: db.Role, as: 'roleData',
                    attributes: ['id', 'code', 'value']
                }
            ]
        })

        resolve({
            err: response ? 0 : 1, // Nếu tìm thấy user thì err = 0
            mes: response ? 'Got user' : 'User not found',
            userData: response 
        })
    } catch (error) {
        reject(error)
    }
})