import * as express from 'express';
import * as cors from 'cors'

const app = express(); // 用于声明服务器端所能提供的http服务

app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello Express");
});

const server = app.listen(8000, "localhost", () => {
    console.log("服务器已启动, 地址是：http://localhost:8000");
});
