npm install 出现rollbackFailedOptional时执行以下操作
	npm config rm proxy
	npm config rm https-proxy
	npm config set registry http://registry.npmjs.org

参考
	https://stackoverflow.com/questions/46011546/npm-install-error-rollbackfailedoptional
