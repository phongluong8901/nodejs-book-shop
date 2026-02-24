import * as services from "../services"
import { internalServerError, badRequest } from "../middlewares/handler_error"
import joi from 'joi'
// Cách 1: Bóc tách trực tiếp (Khuyên dùng để tránh lỗi undefined schemas)
import { title, image, category_code, price, available } from '../helpers/joi_schema'

export const getBooks = async (req, res) => {
    try {
        const response = await services.getBooks(req.query)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const creatNewBook = async (req, res) => {
    try {
        const fileData = req.file; 
        
        if (fileData) req.body.image = fileData.path; 

        const { error } = joi.object({ title, image, category_code, price, available }).validate(req.body)

        if (error) {
            if (fileData) cloudinary.uploader.destroy(fileData.filename);
            return badRequest(error.details[0].message, res)
        }

        // Đã truyền đủ 2 đối số: body và fileData
        const response = await services.createNewBook(req.body, fileData) 
        return res.status(200).json(response)

    } catch (error) {
        // Dùng fileData ở đây cho an toàn
        if (req.file) cloudinary.uploader.destroy(req.file.filename);
        return internalServerError(res)
    }
}

// UPDATE
export const updateBook = async (req, res) => {
    try {
        const fileData = req.file;
        const { error } = joi.object({ bid: joi.string().required() }).validate({ bid: req.body.bid });
        
        if (error) {
            if (fileData) cloudinary.uploader.destroy(fileData.filename);
            return badRequest(error.details[0].message, res);
        }

        const response = await services.updateBook(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const deleteBook = async (req, res) => {
    try {
        // Bước 1: Lấy bids từ query
        const rawBids = req.query.bids;

        // Bước 2: Ép kiểu (Nếu là chuỗi thì biến thành mảng 1 phần tử)
        const bidsArray = typeof rawBids === 'string' ? [rawBids] : rawBids;

        // Bước 3: Validate mảng này
        const { error } = joi.object({ 
            bids: joi.array().required() 
        }).validate({ bids: bidsArray });

        if (error) {
            return badRequest(error.details[0].message, res);
        }

        // Bước 4: Gọi service với mảng đã chuẩn hóa
        const response = await services.deleteBook(bidsArray);
        return res.status(200).json(response);

    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}