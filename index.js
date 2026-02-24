import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import initRoutes from './src/routes'
import './connection_databse' // Import trực tiếp để chạy file kết nối

dotenv.config()

const app = express()

// Middleware đọc dữ liệu (PHẢI ĐỂ TRƯỚC initRoutes)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

initRoutes(app)

const PORT = process.env.PORT || 8888
const listener = app.listen(PORT, () => {
    console.log(`Server is running on port: ${listener.address().port}`)
})