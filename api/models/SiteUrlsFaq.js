const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

// const models = require('./User');

// console.log(models);

const SiteUrlsFaq = sequelize.define('SiteUrlsFaq', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      siteUrlId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      question: Sequelize.TEXT,
      answer: Sequelize.TEXT,
      createdBy: Sequelize.STRING,
      updatedBy: Sequelize.STRING,
      createdTime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedTime: {
        allowNull: false,
        type: Sequelize.DATE
      }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdTime',
    updatedAt: 'updatedTime',
    tableName: 'site_urls_faqs',
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default'
});

SiteUrlsFaq.getFaqsById = async (id) => {
    let opts = {
        where: {
            siteUrlId : id
        }
    };
    return SiteUrlsFaq.findAll(opts)
    .then((result) => {
        return JSON.parse(JSON.stringify(result));
    });
},


module.exports = SiteUrlsFaq;