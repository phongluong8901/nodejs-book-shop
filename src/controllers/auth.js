import * as services from "../services"
import { internalServerError, badRequest } from "../middlewares/handler_error"
import {email, password} from "../helpers/joi_schema"
import joi from 'joi'


export const register = async (req, res) => {
    try {
        const {error} = joi.object({email, password}).validate(req.body)
        if (error) return badRequest(error.details[0]?.message, res)
        const response = await services.register(req.body) 
        return res.status(200).json(response)
    } catch (error) {
        console.log('>>> LỖI TẠI CONTROLLER REGISTER:', error) // THÊM DÒNG NÀY
        return internalServerError(res)
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) return res.status(400).json({
            err: 1,
            mes: 'Missing payloads'
        })
        const response = await services.login(req.body) 
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const refreshToken = async (req, res) => {
    try {
        // 1. Validate xem client có gửi refresh_token lên không
        const { error } = joi.object({ refresh_token: joi.string().required() }).validate(req.body)
        if (error) return badRequest(error.details[0]?.message, res)

        // 2. Gọi service để xử lý logic
        const response = await services.refreshToken(req.body.refresh_token) 
        
        return res.status(200).json(response)
    } catch (error) {
        console.log('>>> LỖI TẠI CONTROLLER REFRESH TOKEN:', error)
        return internalServerError(res)
    }
}