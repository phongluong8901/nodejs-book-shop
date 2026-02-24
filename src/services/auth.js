import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8))

export const register = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        console.log('1. Đã vào hàm Register');
        
        const response = await db.User.findOrCreate({
            where: { email },
            defaults: {
                email,
                password: hashPassword(password)
            }
        });

        console.log('2. Đã xong findOrCreate');
        const isCreated = response[1];
        const user = response[0];

        const accessToken = isCreated ? jwt.sign(
            { id: user.id, email: user.email, role: user.role_code }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }) : null;
        
        console.log('3. Đã xong Access Token');

        const refreshToken = isCreated ? jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET_REFRESH_TOKEN, // KIỂM TRA TÊN BIẾN NÀY TRONG .ENV
            { expiresIn: '7d' }) : null;

        console.log('4. Đã xong Refresh Token:', refreshToken ? 'OK' : 'NULL');

        if (isCreated && refreshToken) {
            console.log('5. Đang chuẩn bị update DB...');
            await db.User.update(
                { refresh_token: refreshToken },
                { where: { id: user.id } }
            );
            console.log('6. Update DB thành công');
        }

        resolve({
            err: isCreated ? 0 : 1,
            mes: isCreated ? 'Register is successfully' : 'Email is used',
            access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
            refresh_token: refreshToken
        });
        
    } catch (error) {
        console.log('--- LỖI PHÁT HIỆN TẠI ĐÂY ---');
        console.error(error); // Cái này chắc chắn sẽ in ra nếu code chạy đến đây
        reject({
            err: 1,
            mes: error.message || 'Internal Server Error'
        });
    }
});
export const login = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { email }
            // BỎ raw: true ở đây để lấy object đầy đủ của Sequelize
        })

        const isChecked = response && bcrypt.compareSync(password, response.password)
        
        if (!isChecked) {
            return resolve({
                err: 1,
                mes: response ? 'Password is wrong' : 'Email has not been registered'
            })
        }

        // Tạo Access Token
        const accessToken = jwt.sign(
            { id: response.id, email: response.email, role: response.role_code },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        // Tạo Refresh Token
        const refreshToken = jwt.sign(
            { id: response.id },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: '7d' }
        )

        // Lưu vào DB - Dùng chính instance 'response' để update cho an toàn
        await response.update({ refresh_token: refreshToken })

        resolve({
            err: 0,
            mes: 'Login is successfully',
            access_token: `Bearer ${accessToken}`,
            refresh_token: refreshToken
        })

    } catch (error) {
        console.error('LỖI LOGIN:', error) // Kiểm tra xem dòng này có hiện không
        reject(error)
    }
})

export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
    try {
        // Bước 1: Tìm token này trong DB xem có tồn tại không
        const response = await db.User.findOne({
            where: { refresh_token },
            raw: true
        })

        if (!response) {
            return resolve({
                err: 1,
                mes: 'Refresh token invalid or not found in DB'
            })
        }

        // Bước 2: Verify token xem có còn hạn không
        jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err, decode) => {
            if (err) {
                return resolve({
                    err: 1,
                    mes: 'Refresh token expired. Please login again.'
                })
            }

            // Bước 3: Tạo Access Token mới dựa trên thông tin cũ (id, email, role)
            const accessToken = jwt.sign(
                { id: response.id, email: response.email, role: response.role_code },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )

            resolve({
                err: 0,
                mes: 'New access token generated',
                access_token: `Bearer ${accessToken}`
            })
        })

    } catch (error) {
        reject(error)
    }
})