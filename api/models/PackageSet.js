const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const { Op } = Sequelize;

const PackageSet = sequelize.define(
  'PackageSet',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    setName: Sequelize.STRING,
    isPro: {
      type: Sequelize.TINYINT,
      field: 'is_pro',
      defaultValue: 0,
    },
    createdTime: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedTime: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdTime',
    updatedAt: 'updatedTime',
    tableName: 'package_sets',
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default',
  }
);

module.exports = PackageSet;
