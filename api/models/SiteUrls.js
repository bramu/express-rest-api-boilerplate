const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const models = require('./User');

// console.log(models);

const SiteUrls = sequelize.define('SiteUrls', {
  
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      categoryId: Sequelize.INTEGER,
      businessCategoryId: Sequelize.INTEGER,
      professionalCategoryId: Sequelize.INTEGER,
      generalCategoryId: Sequelize.INTEGER,
      fileFormatId: Sequelize.INTEGER,
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      name: Sequelize.STRING,
      tagline: Sequelize.STRING,
      headerBannerSection: {
        allowNull: true,
        type: Sequelize.JSON
      },
      headerDescription: Sequelize.TEXT,
      footerDescription: Sequelize.TEXT,
      metaTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      metaDescription: Sequelize.STRING,
      bannerImageUrl: Sequelize.STRING,
      landingPageImageUrl: Sequelize.STRING,
      productCount: Sequelize.INTEGER,
      freeProductsCount: Sequelize.INTEGER,
      status: Sequelize.TINYINT,
      salesPitchPageId: Sequelize.INTEGER,
      salesPitchPageUrl: Sequelize.STRING,
      createdBy: Sequelize.STRING,
      updatedBy: Sequelize.STRING,
      createdTime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedTime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      headerButtonSubHeading: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      editingStatus: Sequelize.TINYINT,
      editingBy: Sequelize.STRING,
      lastEditTime: Sequelize.DATE,
      add_banner_heading: Sequelize.STRING,
      stickyBanner: Sequelize.TINYINT

}, {
    freezeTableName: true,
    tableName: 'site_urls',
    timestamps: false,
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default'
  });

SiteUrls.getAll = async() => {
    return SiteUrls.findAll();
};

SiteUrls.getByUrl = async(qOpts) => {
    let opts={
        where:{
            url: qOpts.url,
            status: 1
        }
    };

    return SiteUrls.findOne(opts)
    .then((result) => {
        return JSON.parse(JSON.stringify(result));
    })
};

SiteUrls.getProductsByUrl = async(qOpts) => {
    let query = `select p.*, supo.orderValue from site_urls_product_order as supo inner join products as p on p.id = supo.productId where supo.siteUrlId = :siteUrlId and p.productStatus = 1 ORDER BY supo.orderValue DESC LIMIT :limit OFFSET :offSet;`;
    let replacements = {
        siteUrlId: qOpts.siteUrlId,
        limit: qOpts.limit,
        offSet: qOpts.offset

    };

    return SiteUrls.sequelize
        .query(query, {
            replacements: replacements
        })
        .then((results) => {
            return JSON.parse(JSON.stringify(results[0]));
        });

};



module.exports = SiteUrls;
