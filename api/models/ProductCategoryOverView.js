const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const ProductCategoryOverView = sequelize.define(
  'ProductCategoryOverView',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    objectType: {
      type: Sequelize.STRING,
      validate: {
        isIn: ['product', 'category'],
      },
    },
    objectId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    overview: Sequelize.TEXT,
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
    tableName: 'product_category_overview',
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default',
  }
);

const pco = ProductCategoryOverView;

pco.getOverView = async (productId) => {
  let opts = {
    attributes: ['overview'],
    where: {
      objectId: productId,
      objectType: 'product',
    },
  };

  return pco.findOne(opts).then((result) => {
    if (result) {
      return result.overview.split(';').filter((each) => each.trim());
    }
    return [];
  });
};

module.exports = pco;
