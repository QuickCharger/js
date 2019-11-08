node + express 以及项目用到的软件的简单介绍
	https://www.jianshu.com/u/bdde2378d666

JavaScript Standard Style standard规范
	https://standardjs.com/readme-zhcn.html

npm install 出现rollbackFailedOptional时执行以下操作
	npm config rm proxy
	npm config rm https-proxy
	npm config set registry http://registry.npmjs.org
参考
	https://stackoverflow.com/questions/46011546/npm-install-error-rollbackfailedoptional

ubuntu 安装指定版本
	sudo apt-get purge nodejs npm
	v=10
	curl -sL https://deb.nodesource.com/setup_$v.x | sudo -E bash -
	sudo apt-get install -y nodejs
