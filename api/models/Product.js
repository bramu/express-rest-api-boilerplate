const Sequelize = require('sequelize');

const sequelize = require('../../config/database');
const ProductCategoryOverView = require('../models/ProductCategoryOverView');

const Op = Sequelize.Op;

const Product = sequelize.define(
  'Product',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: Sequelize.STRING,
    slug: Sequelize.STRING,
    description: Sequelize.TEXT,
    metaTitle: Sequelize.STRING,
    metaKeywords: Sequelize.STRING,
    metaDescription: Sequelize.STRING,
    price: Sequelize.FLOAT,
    productStatus: Sequelize.TINYINT,
    extendedLicensePrice: Sequelize.FLOAT,
    productType: {
      type: Sequelize.ENUM,
      values: ['DOWNLOAD', 'SVG', 'HTML', 'EDITABLE'],
    },
    displayOnHomePage: Sequelize.TINYINT,
    thumbnail: Sequelize.STRING,
    thumbnailWidth: Sequelize.INTEGER,
    thumbnailHeight: Sequelize.INTEGER,
    generatebyEditor: Sequelize.TINYINT,
    isPro: {
      type: Sequelize.TINYINT,
      field: 'is_pro',
      defaultValue: 0,
    },
    userId: Sequelize.INTEGER,
    editingStatus: Sequelize.TINYINT,
    editingBy: Sequelize.INTEGER,
    lastEditTime: Sequelize.DATE,
    updatedBy: Sequelize.STRING,
    fileFormatsError: Sequelize.INTEGER,
    size: Sequelize.INTEGER,
    parentCategoryId: Sequelize.INTEGER,
    parentCategoryName: Sequelize.STRING,
    parentCategoryUrl: Sequelize.STRING,
    proParentCategoryId: Sequelize.INTEGER,
    proParentCategoryName: Sequelize.STRING,
    proParentCategorySlug: Sequelize.STRING,
    popularIndex: Sequelize.INTEGER,
    proPopularIndex: Sequelize.INTEGER,
    newFeaturedImage: Sequelize.STRING,
    defaultFileformat: Sequelize.STRING,
    wordpressDemoUrl: Sequelize.STRING,
    relatedProducts: Sequelize.STRING,
    proPlus: {
      allowNull: true,
      type: Sequelize.TINYINT,
    },
    viewDemo: Sequelize.TINYINT,
    pricingPageUrl: Sequelize.STRING,
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
    tableName: 'products',
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default',
  }
);

const HomePageQueryOpts = {
  attributes: [
    'id',
    'title',
    'slug',
    'newFeaturedImage',
    'productType',
    'newThumbWidth',
    'newThumbHeight',
    'parentCategoryId',
    'parentCategoryName',
    'parentCategoryUrl',
    'createdTime',
    'popularIndex',
    'homePagePosition',
    'isPro',
    'proParentCategoryName',
    'proParentCategorySlug',
    'wordpressDemoUrl',
    'proPlus',
  ],
  where: {
    // productType: 'DOWNLOAD',
    $or: [
      {
        productType: {
          $eq: 'DOWNLOAD',
        },
      },
      {
        productType: {
          $eq: 'EDITABLE',
        },
      },
    ],
    productStatus: 1,
  },
  order: [
    ['homePagePosition', 'DESC'],
    ['createdTime', 'DESC'],
  ],
  limit: 30,
  offset: 0,
  raw: true,
};

Product.getHomePageProducts = async (qOpts) => {
  let opts = _.cloneDeep(HomePageQueryOpts);
  opts.where.title = {
    [Op.ne]: 'Auto Draft',
  };
  if (!_.isEmpty(qOpts)) {
    if (qOpts.limit) {
      opts.limit = qOpts.limit;
    }
    if (qOpts.offset) {
      opts.offset = qOpts.offset;
    }
  }
  return Product.findAndCountAll(opts);
};

Product.getByIdSlug = async (qOpts) => {
  let opts = {
    where: {
      id: qOpts.productId,
      slug: qOpts.slug,
      productStatus: 1,
    },
  };

  return Product.findOne(opts).then((product) => {
    return JSON.parse(JSON.stringify(product));
  });
};

module.exports = Product;
