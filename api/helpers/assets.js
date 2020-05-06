const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');
const AWS = require('aws-sdk');

const ID = 'AKIAIOAFAC3L5DS7XTYQ';
const SECRET = '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';
const BUCKET_NAME = 'rocking-rohit-bucket';

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const uploadFile = (fileName) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'test.js', // File name you want to save as in S3
    Body: fileContent,
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

const getJavascriptFile = () => {
  const jsFiles = fs.readdirSync(path.join(__dirname, '../../assets/js/'));

  const name = 'rohit';

  let returnString = '';
  if (process.env.ENVIRONMENT === 'prod') {
    // get the md5 of each file and create file name as categories-<md5>.js
    let hash = '';
    jsFiles.forEach((script) => {
      hash += v4(script);
    });
    // eslint-disable-next-line no-plusplus
    hash = `category-${v4(hash)}.js`;
    returnString = `<script type="text/javascript" src="${hash}"></script>`;
  } else {
    returnString = jsFiles
      .map((script) => `<script src="/assets/js/${script}"></script>`)
      .join('\n');
    // let hash = '';
    // let content;
    // for (let i = 0; i < jsFiles.length; i += 1) {
    //   content = fs.readFileSync(
    //     path.join(__dirname, `../../assets/js/${jsFiles[i]}`)
    //   );
    //   hash += content;
    // }

    // const hashname = `category-${v4(hash)}.js`;
    // fs.writeFile(`assets/js/${hashname}.js`, hash, (err) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log('success');
    //   }
    // });
    // returnString = `<script type="text/javascript" src="/assets/js/${hashname}"></script>`;
  }

  return returnString;
};

module.exports = {
  getJavascriptFile,
  uploadFile,
};
