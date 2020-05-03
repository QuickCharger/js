const net = require('net');
let easy = require('../lib/easy')

// let process = [
// 	{HostName:"127.0.0.1", Port:1234, SpeedSize = [1,1,1,1000000,1000000, 1000000]},
// 	{HostName:"127.0.0.1", Port:2345, SpeedSize = [1,1,1,1000000,1000000, 1000000]},
// 	{HostName:"127.0.0.1", Port:3456, SpeedSize = [1,1,1,1000000,1000000, 1000000]},
// ]

function speedLog(from, to, siz, ms) {
	let speed = siz / ms
	speed = easy.Fill(speed.toFixed(2), 8, " ")
	if(siz < 1000) {
		siz = easy.Fill(siz, 4, " ") + " B"
	} else if(siz < 1000000) {
		siz = easy.Fill(parseInt(siz/1000), 4, " ") + "KB"
	} else if(siz < 1000000000) {
		siz = easy.Fill(parseInt(siz/1000000), 4, " ") + "MB"
	}

	ms = easy.Fill(ms.toFixed(2), 8, " ")
	console.log(`${from} => ${to}\t package size ${siz}   cost ${ms}ms   speed ${speed}KB/s`)
}

const hostname = '127.0.0.1';
const portSpeed = 1001

let speedCount = -1
let speedSize = [
	0, 0, 0, 0, 0, 0,
	100000,
	100000,
	100000,
	1000000,
	1000000,
	1000000,
	10000000,
	10000000,
	10000000,
]

function TestSpeed() {
	if(speedSize.length <= ++speedCount)
		return
	let bufRecv = new easy.TcpBufRecv
	const socket = new net.Socket();
	socket.setEncoding = 'UTF-8';
	let tBegin = 0
	let send = ''
	socket.connect( portSpeed, hostname, function(){
		send = easy.RandString(speedSize[speedCount])
		send = new easy.TcpBufSend(easy.MsgType.speed, send).Serialize()
		tBegin = process.uptime()
		// console.log(`count ${speedCount} send size ${send.length}`)
		socket.write(send);
	}).on( 'data', function ( msg ) {
		let cur = process.uptime()
		// console.log(`get msg ${msg}`)
		bufRecv.DeSerialize(msg, (type, msg) => {
			speedLog("", "", send.length, (cur-tBegin)*1000)
			socket.destroy()
			setTimeout(TestSpeed, 100);
		})
	});
}
setTimeout(TestSpeed)
