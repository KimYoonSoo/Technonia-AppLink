/****************************************************************
* 서비스 동작 로깅을 위한 유틸리티 클래스
*****************************************************************/
/*
https://velog.io/@ash/Node.js-%EC%84%9C%EB%B2%84%EC%97%90-logging-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-winston-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
https://kooku.netlify.app/node.js/winston%EC%9C%BC%EB%A1%9C-log-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0/
*/ 

var winston = require('winston');
var winstonDaily = require('winston-daily-rotate-file');

var config = require('../config/config');

const logDir = config.logDir;  // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, printf } = winston.format;

// Clustering Mode로 동작할 경우를 대바하여 PID를 기록한다.
const processID = require('process').pid;

// Define log format
const logFormat = printf(info => {
  return `[${processID}] ${info.timestamp} ${info.level}: ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // info 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 30,  // 30일치 로그 파일 저장
      zippedArchive: true, 
    }),
    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',  // error.log 파일은 /logs/error 하위에 저장 
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

// Production 환경이 아닌 경우(dev 등) 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),  // 색깔 넣어서 출력
      winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
    )
  }));
}

module.exports = logger;
