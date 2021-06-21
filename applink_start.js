/****************************************************************
* Technonia AppLink Redirection Service 메인(시작) 모듈
*****************************************************************/

//==============================================================//
//=== 프로젝트/서비스 환경 구성 ===//
var config = require('./config/config');        // Configuration
var logger = require('./utils/logger');         // Main logger
var process = require('process');               // 자원해제를 위한 핸들러 구성 위함
//==============================================================//


//==============================================================//
// 서비스 시작에 대한 로그 기록
logger.info("\r\n-----------------------------------------------------\r\n" 
+ ">>> Technonia - AppLink Server Starting... >>>" + "\r\n"
+ "=====================================================\r\n");
//==============================================================//


//==============================================================//
// 서버 동작을 위한 설정
//=== Express & Web ===//
var express = require('express')
  , http = require('http')
  , serveStatic = require('serve-static')
  , errorHandler = require('errorhandler')
  , expressErrorHandler = require('express-error-handler');

var path = require('path');

// Express 생성 및 설정
var app = express();

// Static routing
app.use('/public', serveStatic(path.join(__dirname, 'public')));  // public 폴더를 static으로 설정하여 제공
app.use('/logs', serveStatic(config.logDir)); // log file 폴더

// Dynamic routing
var applink = require('./routers/applink');
app.use('/applink', applink);

// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});
app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );
//==============================================================//


//==============================================================//
//=== 서버 동작시 참조할 (환경) 변수 ===//
app.set('server_port', process.env.SERVER_PORT || config.server_port);

//=== 서버의 동작환경 점검 ===//
var env_check = require('./utils/env_check'); // Utility
env_check.env_check();
//==============================================================//


//==============================================================//
//=== Service starting ===//
http.createServer(app).listen(app.get('server_port'), function(){
  logger.info("Technonia - AppLink Server running at " + app.get('server_port'));
});
//==============================================================//


//==============================================================//
// 종료 및 예외 사항에 대한 처리 (로그 생성 포함)
//=== Excaption handling ===//
//ref) https://www.tutorialspoint.com/nodejs/nodejs_process.htm
//     https://nodejs.org/api/process.html
//ref) https://nodejs.org/ko/docs/guides/timers-in-node/ 

// setImmediate로 감싼 상티에서 실행될 것을 가정함.
var gracefulExit = function() { 
  process.exit(0);
}

process.on('uncaughtException', function(err) {
  setImmediate((arg) => {
    logger.info("\r\n-----------------------------------------------------\r\n" 
                  + "!!! Technonia - AppLink Server Exception !!! " + arg + "\r\n"
                  + "=====================================================\r\n");
    gracefulExit(); //<참고> 'uncaughtException의 기본 동작은 stack을 trace한 후 종료한다.
  }, err);
});
process.on('SIGINT', function() {
  setImmediate((arg) => {
    logger.info("\r\n-----------------------------------------------------\r\n" 
                  + "!!! Technonia - AppLink Server SIGINT !!! " + arg + "\r\n"
                  + "=====================================================\r\n");
    gracefulExit(); //<참고> 'SIGINT 기본 동작에 따라 종료한다.
  }, 'SIGINT-handler');
});
process.on('SIGTERM', function() {
  setImmediate((arg) => {
    logger.info("\r\n-----------------------------------------------------\r\n" 
                + "!!! Technonia - AppLink Server SIGTERM !!! " + arg + "\r\n"
                + "=====================================================\r\n");
    gracefulExit(); //<참고> 'SIGTERM 기본 동작에 따라 종료한다.
  }, 'SIGTERM-handler');
});
process.on('exit', function(code) {
  setImmediate((arg) => {
    logger.info("\r\n-----------------------------------------------------\r\n" 
                + "<<< Technonia - AppLink Server Exiting... <<<" + arg + "\r\n"
                + "=====================================================\r\n");
    gracefulExit(); //<참고> 'SIGTERM 기본 동작에 따라 종료한다. 종료되는 상황에 따라 호출되지 않을 수 있다.
  }, code);
});
//==============================================================//