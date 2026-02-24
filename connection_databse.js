const { Sequelize } = require('sequelize');

// Thêm tham số port vào đây
const sequelize = new Sequelize('store', 'root', null, { 
  host: 'localhost',
  dialect: 'mysql',
  port: 3307, // <--- Quan trọng nhất là dòng này
  logging: false // (Tùy chọn) Để console không bị rối bởi các dòng lệnh SQL
});

const connectionDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
}

connectionDatabase();

module.exports = connectionDatabase;