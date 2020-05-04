const _ = require('lodash');

const assetsJscon = {
	categories: ['javascripts/common.js', 'javascripts/categories.js'],
};

const Assets = () => {
	const getJavascriptFile = (key) => {
		const files = assetsJscon[key];

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
			for (let i = 0; i < files.length; i++) {
				returnString = `<script type="text/javascript" src="${files[i]}"></script>`;
			}
		}

		return returnString;
	};
};

module.exports = Assets;
