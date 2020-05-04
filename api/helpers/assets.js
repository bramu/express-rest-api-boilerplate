const _ = require('lodash');

const Assets = () => {
	const getJavascriptFile = (key) => {
		const assetsJscon = {
			categories: ['javascripts/common.js', 'javascripts/categories.js'],
		};

		const files = assetsJscon[key];

		let returnString = '';
		if (process.env.ENVIRONMENT === 'prod') {
			// here the uglifier code comes here
		} else {
			for (let i = 0; i < files.length; i++) {
				returnString = `<script type="text/javascript" src="${files[i]}"></script>`;
			}
		}

		return returnString;
	};
};

module.exports = Assets;
