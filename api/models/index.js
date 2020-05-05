const fs = require('fs');
const path = require('path');

const getAllModels = () => {
  const DB = {};
  const files = fs.readdirSync(__dirname);
  files.forEach((r) => {
    const modelname = r.split('.')[0];
    if (modelname !== 'index') {
      DB[modelname] = require(`./${modelname}`);
    }
  });

  return DB;
};

module.exports = getAllModels;
