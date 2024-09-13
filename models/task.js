'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Task.init({
    userId: {
      type: DataTypes.INTEGER,
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
        model: 'User',
        key: 'id',
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    dueDate: DataTypes.DATE,
    priority: {
      type: DataTypes.ENUM,
      values: ['low', 'medium', 'high'],
      defaultValue: 'low'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'completed', 'cancelled'],
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};