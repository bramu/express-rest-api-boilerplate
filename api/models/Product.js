const Sequelize = require('sequelize');

const sequelize = require('../../config/database');
const ProductCategoryOverView = require('./ProductCategoryOverView');

const RelatedProductsQuery = `SELECT n.proPlus,n.id, n.title, n.slug, n.newFeaturedImage, n.newThumbHeight, n.newThumbWidth, n.parentCategoryName, n.parentCategoryUrl, n.parentCategoryId, n.is_pro, n.proParentCategoryName, n.proParentCategorySlug, n.proParentCategoryId, MATCH (title) AGAINST (:productTitle IN NATURAL LANGUAGE MODE) AS score
FROM products n INNER JOIN  site_urls_product_order  supo  ON n.id = supo.productId
WHERE supo.siteUrlId IN (:siteUrlsId) AND MATCH (title) AGAINST (:productTitle IN NATURAL LANGUAGE MODE) > 0 AND n.productStatus = :productStatus AND n.is_pro in (:isPro)  AND n.productType = :productType AND n.id <> :productId AND n.id
GROUP BY n.id ORDER BY score DESC LIMIT :perPage OFFSET :offSet;
`;

const { Op } = Sequelize;

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
  const opts = _.cloneDeep(HomePageQueryOpts);
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
  const opts = {
    where: {
      id: qOpts.productId,
      slug: qOpts.slug,
      productStatus: 1,
    },
  };

  return Product.findOne(opts).then((product) =>
    JSON.parse(JSON.stringify(product))
  );
};

Product.getRelatedProducts = async (ids) => {
  const opts = {
    where: {
      id: {
        [Op.in]: ids,
      },
      productStatus: 1,
      limit: 12,
    },
  };

  return Product.findAll(opts).then((result) => {
    return JSON.parse(JSON.stringify(result));
  });
};

Product.getRelatedProducts = async (data) => {
  const replacements = {
    productId: data.productId,
    productStatus: 1,
    productTitle: data.productTitle,
    siteUrlsId: data.siteUrlsId,
    productType: 'DOWNLOAD',
    perPage: data.perPage,
    isPro: [data.isPro],
    offSet: data.offSet,
    proPlus: 1,
  };

  if (data.isPro === 0) {
    replacements.isPro = [0, 1];
  }

  return Product.sequelize
    .query(RelatedProductsQuery, {
      replacements,
    })
    .then((result) => {
      return result[0];
    });
};

Product.getRelatedProductsNew = async (ids) => {
  const opts = {
    attributes: [
      'id',
      'title',
      'slug',
      'thumbnail',
      'thumbnailWidth',
      'thumbnailHeight',
      'isPro',
      'parentCategoryId',
      'parentCategoryName',
      'parentCategoryUrl',
      'proParentCategoryId',
      'proParentCategoryName',
      'proParentCategorySlug',
      'newFeaturedImage',
      'defaultFileformat',
      'proPlus',
    ],
    where: {
      id: {
        [Op.in]: ids,
      },
      productStatus: 1,
      productType: {
        [Op.or]: ['DOWNLOAD', 'EDITABLE'],
      },
    },
    order: [Sequelize.fn('FIELD', Sequelize.col('id'), ids)],
    limit: 12,
  };
  return Product.findAll(opts);
};

Product.getByIds = async (ids) => {
  const opts = {
    attributes: [
      'id',
      'title',
      'slug',
      'is_pro',
      'parentCategoryName',
      'proParentCategoryName',
      'proPlus',
      'newFeaturedImage',
    ],
    where: {
      id: {
        [Op.in]: ids,
      },
      productStatus: 1,
    },
  };

  return Product.findAll(opts).then((result) => {
    return JSON.parse(JSON.stringify(result));
  });
};
module.exports = Product;
