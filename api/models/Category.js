const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const Op = Sequelize.Op;

const Category = sequelize.define(
  'Category',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: Sequelize.STRING,
    slug: Sequelize.STRING,
    url: {
      type: Sequelize.STRING,
      unique: true,
    },
    mainTitle: Sequelize.STRING,
    tagline: Sequelize.STRING,
    parent: Sequelize.INTEGER,
    level: Sequelize.INTEGER,
    position: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    description: Sequelize.TEXT,
    metaTitle: Sequelize.STRING,
    metaKeywords: Sequelize.STRING,
    metaDescription: Sequelize.STRING,
    headerDescription: Sequelize.STRING,
    makeUrlPublic: Sequelize.TINYINT,
    free: Sequelize.TINYINT,
    pro: Sequelize.TINYINT,
    exitIntentPostId: Sequelize.INTEGER,
    catFileFormats: Sequelize.STRING,
    fileFormats: Sequelize.STRING,
    mostPopular: Sequelize.TINYINT,
    proCategoryId: Sequelize.INTEGER,
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
    tableName: 'categories',
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default',
  }
);

module.exports = Category;
