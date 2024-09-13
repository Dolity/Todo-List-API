'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'User ID cannot be null'
          },
          notEmpty: {
            msg: 'User ID cannot be empty'
          }
        },
        references: {
          model: 'Users',
          key: 'id',
          onDelete: 'cascade',
          onUpdate: 'cascade'
        }
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      dueDate: {
        type: Sequelize.DATE
      },
      priority: {
        type: Sequelize.ENUM,
        values: ['low', 'medium', 'high'],
        defaultValue: 'low'
      },
      status: {
        type: Sequelize.ENUM,
        values: ['cancelled', 'pending', 'completed'],
        defaultValue: 'pending'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tasks');
  }
};