const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const Op = Sequelize.Op;

const ProductImages = sequelize.define(
  'ProductImages',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    productId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    imageType: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    imageUrl: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    altTag: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    height: Sequelize.INTEGER,
    width: Sequelize.INTEGER,
    orderValue: Sequelize.INTEGER,
    size: Sequelize.INTEGER,
    createdTime: Sequelize.DATE,
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdTime',
    updatedAt: false,
    tableName: 'product_images',
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default',
  }
);

const pi = ProductImages;

pi.getByProductId = async (productId) => {
  let opts = {
    attributes: ['productId', 'imageType', 'imageUrl', 'altTag', 'orderValue'],
    where: {
      productId: productId,
      imageType: {
        [Op.in]: ['Image440', 'Slider'],
      },
    },
    order: [['orderValue', 'ASC']],
  };
  return pi.findAll(opts).then((images) => {
    return JSON.parse(JSON.stringify(images));
  });
};

module.exports = pi;
