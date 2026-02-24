import db from '../models'
import { Op } from 'sequelize'
import {v4 as generateId} from 'uuid'
const cloudinary = require('cloudinary').v2;

/**
 * Service lấy danh sách sách kèm Phân trang, Sắp xếp và Bộ lọc
 */
export const getBooks = ({ page, limit, order, title, price, ...query }) => new Promise(async (resolve, reject) => {
    try {
        // 1. XỬ LÝ LỖI "order[]":
        // Khi gửi từ Postman/URL là order[]=price&order[]=DESC, Express sẽ tạo key là 'order[]'
        // Nếu không lấy ra và xóa đi, ...query sẽ đưa nó vào WHERE gây lỗi "Unknown column"
        const customOrder = order || query['order[]']
        delete query['order[]'] 

        const queries = { nest: true }
        
        // 2. Phân trang (Pagination)
        const offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const flimit = +limit || +process.env.LIMIT_BOOK || 10
        queries.offset = offset * flimit
        queries.limit = flimit

        // 3. Sắp xếp (Sort)
        // Cấu trúc Sequelize cần là: queries.order = [['price', 'DESC']]
        if (customOrder) {
            queries.order = [customOrder]
        }

        // 4. Bộ lọc (Filter)
        // Tìm kiếm theo tên (LIKE %title%)
        if (title) query.title = { [Op.substring]: title }
        
        // Lọc trong khoảng giá [min, max]
        if (price) query.price = { [Op.between]: price }

        // Thực hiện truy vấn
        const response = await db.Book.findAndCountAll({
            where: query, // Chứa các filter sạch (categoryCode, title...)
            ...queries,
            distinct: true, // Tránh đếm lặp khi Join bảng (include)
            attributes: {
                // Ẩn các cột không cần thiết để giảm tải data
                exclude: ['categoryCode', 'createdAt', 'updatedAt']
            },
            include: [
                { 
                    model: db.Category, 
                    as: 'categoryData', 
                    attributes: ['code', 'value'] 
                }
            ]
        })

        resolve({
            err: response ? 0 : 1,
            mes: response ? 'Got books successfully' : 'Cannot get books',
            bookData: response
        })

    } catch (error) {
        reject(error)
    }
})

export const createNewBook = (body, fileData) => new Promise(async (resolve, reject) => {
    try {
        const { category_code, ...rest } = body;

        const response = await db.Book.findOrCreate({
            where: { title: body?.title }, 
            defaults: {
                ...rest,
                categoryCode: category_code,
                id: generateId(),
                image: fileData?.path,
                fileName: fileData?.filename
            }
        })

        const isCreated = response[1];
        resolve({
            err: isCreated ? 0 : 1,
            mes: isCreated ? 'Created' : 'Cannot create new book/Title already exists',

        })

        // Nếu KHÔNG tạo được (trùng title), xóa ảnh trên mây cho sạch
        if (!isCreated && fileData) {
            cloudinary.uploader.destroy(fileData.filename);
        }

    } catch (error) {
        // Nếu lỗi hệ thống, xóa ảnh luôn
        if (fileData) cloudinary.uploader.destroy(fileData.filename);
        reject(error)
    }
})

// UPDATE BOOK
export const updateBook = ({ bid, ...body }, fileData) => new Promise(async (resolve, reject) => {
    try {
        // Nếu có upload ảnh mới, thêm link ảnh vào data cập nhật
        if (fileData) body.image = fileData.path;

        const response = await db.Book.update(body, {
            where: { id: bid }
        });

        resolve({
            err: response[0] > 0 ? 0 : 1,
            mes: response[0] > 0 ? 'Updated' : 'Cannot update book/Book ID not found',
        });

        // HẬU KIỂM: Nếu update thất bại hoặc có ảnh mới, cần dọn dẹp Cloudinary
        if (response[0] === 0 && fileData) {
            cloudinary.uploader.destroy(fileData.filename);
        }
    } catch (error) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename);
        reject(error);
    }
});

// DELETE BOOK (Bản sửa lỗi để xóa cả ảnh trên mây)
export const deleteBook = (bids) => new Promise(async (resolve, reject) => {
    try {
        // 1. Tìm các cuốn sách để lấy danh sách fileName trước khi xóa khỏi DB
        const books = await db.Book.findAll({
            where: { id: bids },
            attributes: ['id', 'fileName'] 
        })

        const fileNames = books.map(book => book.fileName).filter(item => item !== null)

        // 2. Xóa trong Database
        const response = await db.Book.destroy({
            where: { id: bids }
        })

        // 3. Nếu xóa DB thành công, gọi Cloudinary xóa ảnh
        if (response > 0 && fileNames.length > 0) {
            // Lưu ý: delete_resources nhận vào một mảng tên file
            await cloudinary.api.delete_resources(fileNames)
        }

        resolve({
            err: response > 0 ? 0 : 1,
            mes: response > 0 ? `Xóa thành công ${response} cuốn sách.` : 'Không tìm thấy ID sách',
        })
    } catch (error) {
        reject(error)
    }
})