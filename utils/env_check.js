/****************************************************************
* 서비스 환경 점검 및 기본 구성을 위한 모듈 
*****************************************************************/

var config = require('../config/config');
var logger = require('./logger');

var process = require('process');
const fs = require('fs');

// 서비스 동작에 필요한 디렉토리 점검
var checkDir = function(dirPath) {
	logger.info("Checking directory : " + dirPath);
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true } );
		logger.info("Directory created : " + dirPath);
	}
	logger.info("Directory <OK> : " + dirPath);
}


// 서비스 동작에 필요한 환경을 점검하고 구성한다.
var env_check = function() {

	// 실제 배포/운영할 경우 'production' 설정을 권장한다.
	if (process.env.NODE_ENV == 'production') {
		// export NODE_ENV=production
		logger.info("Production Mode");
	} else if (process.env.NODE_ENV == 'development') {
		logger.info("Development Mode - Production mode required on release.");
	} else {
		logger.info("Unknown Mode - Production mode required on release.");
	}

	// 폴더 점검
	checkDir(config.logDir);
}

module.exports.env_check = env_check;
