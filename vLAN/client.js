const net = require('net');
let easy = require('../lib/easy')

const hostname = '127.0.0.1';
const portSpeed = 1001

let speedCount = -1
let speedSize = [
	1, 1, 1,
	1000000,			//1MB
	50000000
]

function TestSpeed() {
	if(speedSize.length <= ++speedCount)
		return
	let bufRecv = new easy.TcpBufRecv
	const socket = new net.Socket();
	socket.setEncoding = 'UTF-8';
	let t1 = 0
	let send = ''
	socket.connect( portSpeed, hostname, function(){
		send = easy.RandString(speedSize[speedCount])
		send = new easy.TcpBufSend(send).Serialize()
		t1 = process.uptime()
		socket.write(send);
	}).on( 'data', function ( msg ) {
		let cur = process.uptime()
		bufRecv.DeSerialize(msg, m => {
			console.log( `${m}. send ${(send.length/1000).toFixed(2)}KB. cost ${(cur - t1).toFixed(3)}s. speed ${(send.length/(cur-t1)/1000).toFixed(3)}KB/s` )
			socket.destroy()
			setTimeout(TestSpeed, 300);
		  })
	});
}
setTimeout(TestSpeed)
