node + express 以及项目用到的软件的简单介绍
	https://www.jianshu.com/u/bdde2378d666

JavaScript Standard Style standard规范
	https://standardjs.com/readme-zhcn.html

npm install 出现rollbackFailedOptional时执行以下操作
	npm config rm proxy
	npm config rm https-proxy
	npm config set registry http://registry.npmjs.org
	npm config set registry https://registry.npm.taobao.org		-- 这个是淘宝的路径 能加快大陆速度

	git config --global  --get http.proxy		-- 查看proxy
	git config --global  --get https.proxy
	git config --global --unset http.proxy		-- 清除proxy
	git config --global --unset https.proxy
	git config --global https.proxy  http://127.0.0.1:1234		-- 设定proxy
	git config --global http.proxy  http://127.0.0.1:1234

参考
	https://stackoverflow.com/questions/46011546/npm-install-error-rollbackfailedoptional

ubuntu 安装指定版本		早于2019年12月13日
	sudo apt-get purge nodejs npm
	v=10
	curl -sL https://deb.nodesource.com/setup_$v.x | sudo -E bash -
	sudo apt-get install -y nodejs

ubuntu 安装npm nodejs	2019年12月13日
apt install npm				// npm独立于nodejs 已经作为一个独立的软件存在于ubuntu的软件库中
npm install -g npm@latest	// 通过npm更新npm
npm install -g n			// n是npm中一个工具，管理nodejs版本
n stable|lts|latest			// 安装nodejs 稳定版|lts版|最新版
npm info pm2				// 查看pm2版本

pm2自动启动
pm2 save
pm2 startup
pm2 init	// 创建pm2启动文件ecosystem.config.js
pm2 start ecosystem.config.js

安装express
准备工作
	npm install express -g
	npm install express-generator -g
创建express框架
	express erp
启动express
	npm run start
参考
	https://www.jianshu.com/p/69e7f3734eb5

安装github
npm install git+https://github.com/QuickCharger/easy.git
