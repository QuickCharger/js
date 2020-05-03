const net = require( 'net' );
let easy = require('../lib/easy')

const portSpeed = 1001
const hostnameSpeed = '0.0.0.0'

const server = new net.createServer();

server.on('connection', (client) => {
	let bufRecv = new easy.TcpBufRecv
	let i = 0
	client.on('data', (msg) => {
		i += msg.length
		bufRecv.DeSerialize(msg, (type, msg1) => {
			client.write(new easy.TcpBufSend(easy.MsgType.over).Serialize())
		})
	}).on('end', () => {
	}).on('close', () =>{
	}).on('error', (e) => {
		console.log(e)
	})
}).listen( portSpeed, hostnameSpeed, () => {
	console.log(`speed run ${hostnameSpeed}:${portSpeed}`);
});
