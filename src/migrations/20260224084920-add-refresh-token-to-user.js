'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột refresh_token vào bảng Users mà không xóa bảng
    await queryInterface.addColumn('Users', 'refresh_token', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Nếu muốn hoàn tác thì xóa cột này đi
    await queryInterface.removeColumn('Users', 'refresh_token');
  }
};