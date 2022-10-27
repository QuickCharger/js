let CONSTANT = {
	SECRET_KEY: 'screttKey',
	PORT:'3000',
	MYSQL_CONFIG:{
		host : '127.0.0.1',
		port : 3306,
		user : 'root',
		password : '123456',
		database : '',
		charset:"utf8mb4",
	},
	Release: false,
};

let fs = require('fs')
// develop配置
if(fs.existsSync("/root/develop")) {
	console.log("this is a develop")
}

// release配置
if(fs.existsSync("/root/release")) {
	console.log("this is a release")
	CONSTANT.Release = true
	CONSTANT.SECRET_KEY = require('crypto').randomBytes(10).toString('base64').slice(0, 10)
	CONSTANT.SECRET_KEY = CONSTANT.SECRET_KEY
}

module.exports = CONSTANT;
