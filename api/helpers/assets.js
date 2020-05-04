const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const getJavascriptFile = () => {
  const jsFiles = fs.readdirSync(path.join(__dirname, '../../assets/js/'));

  let returnString = '';
  if (process.env.ENVIRONMENT === 'prod') {
    // get the md5 of each file and create file name as categories-<md5>.js
    let hash = '';
    for (let i = 0; i < files.length; i++) {
      hash = hash + md5File.sync(files[i]);
    }
    hash = key + '-' + md5(hash) + '.js';
    returnString = `<script type="text/javascript" src="${hash}"></script>`;
  } else {
    returnString = jsFiles
      .map((script) => `<script src="/assets/js/${script}"></script>`)
      .join('\n');
  }

  return returnString;
};

module.exports = getJavascriptFile;
