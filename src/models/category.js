'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Một Category có nhiều Book (phút 00:01:40)
      Category.hasMany(models.Book, { 
        foreignKey: 'categoryCode', 
        sourceKey: 'code', 
        as: 'bookData' 
      });
    }
  }
  Category.init({
    code: DataTypes.STRING,
    value: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};