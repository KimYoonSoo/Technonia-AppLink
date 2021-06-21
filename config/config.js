/****************************************************************
* 설정 파일
*****************************************************************/

module.exports = {
	//=== Main settings ===//
	// 서버 설정
	server_baseUrl: "http://applink.technonia.com",
	server_port: 8080,
	// 로그 파일 저장 경로
	logDir: require('path').join(__dirname, '..', 'logs')
}
