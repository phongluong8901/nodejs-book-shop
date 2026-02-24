import db from '../models'
import data from '../../data/data.json'
import { generateCode } from '../helpers/fn'

export const insertData = () => new Promise(async (resolve, reject) => {
    try {
        const dataArray = Object.entries(data);
        
        // Xóa trắng bảng cũ trước khi chèn để không bị lỗi Duplicate ID khi bạn test lại
        await db.Book.destroy({ where: {} });
        await db.Category.destroy({ where: {} });

        for (let item of dataArray) {
            const [categoryName, books] = item;
            const categoryCode = generateCode(categoryName);

            // Chèn Category
            await db.Category.create({
                code: categoryCode,
                value: categoryName
            });

            // Chèn danh sách Books
            for (let book of books) {
                await db.Book.create({
                    id: book.upc,
                    title: book.bookTitle,
                    price: parseFloat(book.bookPrice.replace('£', '')),
                    available: parseInt(book.available),
                    image: book.imageUrl,
                    description: book.bookDescription,
                    categoryCode: categoryCode
                });
            }
        }
        resolve({ err: 0, msg: 'Done!' });
    } catch (error) {
        reject(error);
    }
});