'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      // Một Book thuộc về một Category (phút 00:42:04)
      Book.belongsTo(models.Category, { 
        foreignKey: 'categoryCode', 
        targetKey: 'code', 
        as: 'categoryData' 
      });
    }
  }
  Book.init({
    // Khai báo id là STRING vì ta dùng UPC làm khóa chính
    id: { type: DataTypes.STRING, primaryKey: true }, 
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    available: DataTypes.INTEGER,
    fileName: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    categoryCode: DataTypes.STRING, // Khóa ngoại dùng để nối bảng
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};