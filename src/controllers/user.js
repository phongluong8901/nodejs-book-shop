import * as services from "../services"
import { internalServerError, badRequest } from "../middlewares/handler_error"
// import {email, password} from "../helpers/joi_schema"
// import joi from 'joi'


export const getCurrent = async (req, res) => {
    try {
        const { id } = req.user // id này được lấy từ token đã decode
        if (!id) return badRequest("User ID not found in token", res)

        const response = await services.getOne(id) 
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}