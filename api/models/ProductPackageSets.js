const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const PackageSet = require('./PackageSet');

const Product = require('./Product');

const { Op } = Sequelize;

const ProductPackageSets = sequelize.define(
  'ProductPackageSet',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    setId: {
      type: Sequelize.INTEGER,
    },
    productId: {
      type: Sequelize.INTEGER,
    },
    createdTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedTime: {
      type: 'TIMESTAMP',
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: 'product_package_sets',
    createdAt: 'createdTime',
    updatedAt: 'updatedTime',
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default',
  }
);

ProductPackageSets.getPackageProducts = async (productId) => {
  let opts = {
    attributes: ['setId'],
    where: {
      productId,
    },
  };

  return ProductPackageSets.findOne(opts)
    .then((result) => {
      if (result) {
        opts = {
          attributes: ['productId'],
          where: {
            setId: result.setId,
          },
        };
        return ProductPackageSets.findAll(opts);
      }
      return [];
    })
    .then((ids) => {
      const productIds = ids.map((item) => item.productId);
      console.log(JSON.parse(JSON.stringify(productIds)));
      return Product.getByIds(productIds);
    })
    .then((products) => {
      return JSON.parse(JSON.stringify(products));
    });
};

ProductPackageSets.belongsTo(PackageSet, {
  foreignKey: 'setId',
  targetKey: 'id',
});
ProductPackageSets.belongsTo(Product, {
  foreignKey: 'productId',
  targetKey: 'id',
});

module.exports = ProductPackageSets;
