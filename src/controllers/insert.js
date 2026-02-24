import * as services from "../services"
import { internalServerError } from "../middlewares/handler_error"

export const insertData = async (req, res) => {
    try {
        // Gọi service không cần truyền tham số
        const response = await services.insertData() 
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}