const net = require( 'net' );
let easy = require('../lib/easy')

let info = {
	ip:"",
	port:"",
}

const portSpeed = 1001
const hostnameSpeed = '0.0.0.0'

const server = new net.createServer();

server.on('connection', (client) => {
  let bufRecv = new easy.TcpBufRecv
  let i = 0
  client.on('data', function (msg) {
    i += msg.length
    console.log(`${msg.length}   ${i}`)
    bufRecv.DeSerialize(msg, m => {
      client.write(new easy.TcpBufSend(`over`).Serialize())
    })
  }).on('end', ()=> {
  }).on('close',()=>{
  }).on('error', e => {
    console.log(e)
  })
}).listen( portSpeed,hostnameSpeed,function () {
  console.log(`speed run ${hostnameSpeed}:${portSpeed}`);
});
