/****************************************************************
* applink router
*****************************************************************/

var logger = require('../../utils/logger');

const applinkAndroid = require('./applinkInfos').applinkAndroid;
const applinkApple = require('./applinkInfos').applinkApple;

var express = require('express');
var router = express.Router();

// 처리 실패
var redirectFailed = function(res, code, appId, logMsg) {
	logger.info(appId + " ==> Failed : " + logMsg);
    res.sendStatus(code);
}

// Redirect
var redirect = function(res, appId, url) {
	logger.info(appId + " ==> redirecting : " + url);
    res.redirect(url);
}

// Android app 요청
router.get('/android/:appid', function(req, res, next) {
    if (req.params.appid) {
        if (req.params.appid in applinkAndroid) {
            redirect(res, req.params.appid, applinkAndroid[req.params.appid]);
        }
        else {
            redirectFailed(res, 404, req.params.appid, "target url not found");
        }
    } else {
        redirectFailed(res, 404, req.params.appid, "invalid request");
    }
});

// Apple app 요청
router.get('/apple/:appid', function(req, res, next) {
    if (req.params.appid) {
        if (req.params.appid in applinkApple) {
            redirect(res, req.params.appid, applinkApple[req.params.appid]);
        }
        else {
            redirectFailed(res, 404, req.params.appid, "target url not found");
        }
    } else {
        redirectFailed(res, 404, req.params.appid, "invalid request");
    }
});
 
module.exports = router;