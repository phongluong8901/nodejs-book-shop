'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột fileName vào bảng Books
    await queryInterface.addColumn('Books', 'fileName', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa cột fileName nếu muốn quay lại (undo)
    await queryInterface.removeColumn('Books', 'fileName');
  }
};