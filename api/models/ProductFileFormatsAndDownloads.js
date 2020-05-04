const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const Op = Sequelize.Op;

const ProductFileFormatsAndDownloads = sequelize.define(
  'ProductFileFormatsAndDownloads',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    productId: Sequelize.INTEGER,
    fileFormat: Sequelize.STRING,
    fileFormatIsPro: Sequelize.TINYINT,
    fileDimension: Sequelize.STRING,
    downloadPath: Sequelize.STRING,
    price: Sequelize.FLOAT,
    createdTime: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdTime',
    updatedAt: false,
    tableName: 'product_file_formats_and_downloads',
    instanceMethods: {},
    hooks: {},
    scopes: {},
    connection: 'default',
  }
);

const pffd = ProductFileFormatsAndDownloads;

pffd.getFileFormats = async (productId) => {
  let opts = {
    attributes: ['fileFormat'],
    where: {
      productId,
    },
  };
  return pffd.findAll(opts).then((fileFormats) => {
    return JSON.parse(JSON.stringify(fileFormats));
  });
};

pffd.getFileFormatDimes = async (productId) => {
  let opts = {
    attributes: [
      'fileFormat',
      'fileFormatIsPro',
      [
        Sequelize.fn('GROUP_CONCAT', Sequelize.col('fileDimension')),
        'fileDimension',
      ],
      [
        Sequelize.fn('GROUP_CONCAT', Sequelize.col('downloadPath')),
        'downloadPath',
      ],
    ],
    group: ['fileFormat', 'fileFormatIsPro'],
    where: {
      productId: productId,
      fileFormat: {
        [Op.notIn]: ['Google Docs', 'MSWordLink'],
      },
    },
  };
  return pffd.findAll(opts).then((result) => {
    return JSON.parse(JSON.stringify(result));
  });
};

module.exports = pffd;
