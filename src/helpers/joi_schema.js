import joi from 'joi'

export const email = joi.string()
    .pattern(new RegExp('@gmail\.com$')) 
    .required()
    .messages({
        'string.pattern.base': 'Email phải có định dạng @gmail.com'
    })

// THÊM LẠI BIẾN NÀY
export const password = joi.string()
    .min(6) // Bạn có thể thêm độ dài tối thiểu nếu muốn
    .required()

export const title = joi.string().required()
export const price = joi.number().required()
export const available = joi.number().required()
export const category_code = joi.string().uppercase().alphanum().required()
export const image = joi.string().required()
export const refreshToken = joi.string().required()