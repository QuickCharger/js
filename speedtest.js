const net = require('net');
const Crypto = require('crypto')

let argv = process.argv.splice(2)
const [MsgType_Speed,MsgType_Speed_Ret,MsgType_Info,MsgType_Info_Ret] = [1,2,3,4]	// MsgType_Speed 测试数据包  MsgType_Speed_Ret 测试数据包返回  MsgType_Info 将要测试的地址等信息
let [defaultPort, packInterval, SpeedSize] = [12345, 500, [0,10000,1000000]]
const strRand = (a_Length => Crypto.randomBytes(a_Length*0.75 + 0.25).toString('base64').slice(0, a_Length))(10000000)
const steps = [
	{host:"127.0.0.1", SpeedSize:[], next:[
		{host:"127.0.0.1", SpeedSize:[0,0,0,10000,10000,10000,1000000,1000000,1000000]},
	]},
]

// init
if(argv[0]) {
	defaultPort = argv[0]
}

let fSpeedLog = (from, to, siz, sec) => `${from.host}:${from.port} => ${to.host}:${to.port}\t package size ${(siz<1000 ? siz : siz < 1000000 ? siz / 1000 : siz / 1000000).toFixed().toString().padStart(4) + (siz<1000 ? " B" : siz < 1000000 ? "KB" : "MB")}   cost ${(sec*1000).toFixed(2).padStart(8)}ms   speed ${(siz / sec / 1000).toFixed(2).padStart(8)}KB/s`

let fDoSpeedTest = async (info = steps, previousSocket = null) => {
	return new Promise(async (resolve, reject) => {
		if(!info || info.length == 0) {
			previousSocket && previousSocket.end()
			return resolve(null)
		}
		for(let step of info) {
			let spdInfo = step.SpeedSize || SpeedSize
			for(let packSize of spdInfo) {
				let param = {siz:packSize, from:{host:previousSocket?previousSocket.localAddress:"this", port:previousSocket?previousSocket.localPort:0}, to:{host:step.host, port:step.port||defaultPort}}
				try{
					let ret = await wait_sync(packInterval, TestSpeed, param)
					previousSocket && previousSocket.write(fSerialize(MsgType_Info_Ret, ret))
					console.log(ret)
				} catch(e) {
					console.log(`do ${JSON.stringify(param)} failed. reason ${e}`)
					previousSocket && previousSocket.end(fSerialize(MsgType_Info_Ret, e))
					break
				}
			}
			if(step.next && step.next.length > 0) {
				await TransNextInfo(step, previousSocket)
			}
		}
		previousSocket && previousSocket.end()
		resolve(null)
	})
}

setTimeout(fDoSpeedTest, 1000);

(function fCreateServer() {
	net.createServer().on('connection', (remote) => {
		let bufRecv = new TcpBufRecv
		let i = 0
		//console.log(`localAddress ${remote.localAddress} localPort ${remote.localPort}  remoteAddress ${remote.remoteAddress} remotePort ${remote.remotePort}`)
		remote.on('data', (msg) => {
			i += msg.length
			bufRecv.DeSerialize(msg, async (type, msg) => {
				if(type == MsgType_Speed) {
					let c = fSerialize(MsgType_Speed_Ret)
					remote.write(c, 'utf8')
				} else if(type == MsgType_Info) {
					let c = JSON.parse(msg)
					console.log(`do ${msg}`)
					await fDoSpeedTest(c, remote)
				}
			})
		}).on('error', (e) => {
			console.log(e)
		})
	}).listen( port=defaultPort, "0.0.0.0", () => {
		console.log(`listen port ${defaultPort} success`);
	}).on("error", (err) => {
		console.log(`listen port ${defaultPort} failed`)
		setTimeout(fCreateServer, 10000)
	})
})();

class TcpBufRecv {
	constructor() {
		this.Buf = new Buffer.alloc(0)
		this.leftPackSize = 0		// 解析当前数据还需要接受的数据量
		this.msgId = 0
	}

	DeSerialize(a_Buf, a_CB, a_DeWrap){
		// if 首次收到新包 else 继续接收包
		if(this.leftPackSize == 0 && this.msgId == 0) {
			let bufHeader = Buffer.from(a_Buf.slice(0,5), "binary")
			this.leftPackSize = bufHeader.readInt32LE()
			this.leftPackSize -= a_Buf.length
			this.msgId = bufHeader.readInt8(4)
			if(this.msgId != MsgType_Speed && this.msgId != MsgType_Speed_Ret) {
				this.Buf = Buffer.concat([this.Buf, Buffer.from(a_Buf.slice(5), "binary")])
			}
		} else {
			this.leftPackSize -= a_Buf.length
			if(this.msgId != MsgType_Speed && this.msgId != MsgType_Speed_Ret) {
				this.Buf = Buffer.concat([this.Buf, Buffer.from(a_Buf, "binary")])
			}
		}
		if(this.leftPackSize == 0 && this.msgId != 0) {
			a_CB(this.msgId, this.Buf.toString("binary"))
			this.Buf = new Buffer.alloc(0)
			this.msgId = 0
		}
	}
}

// 4 + 1 + context
let fSerialize = (type, context = '') => {
	let bufencode = Buffer.alloc(5, "binary")
	bufencode.writeInt32LE(context.length + 5)
	bufencode.writeInt8(type, 4)
	return Buffer.concat([bufencode, Buffer.from(context, "binary")])
}

function TestSpeed({from, to, siz}) {
	return new Promise((resolve, reject) => {
		let bufRecv = new TcpBufRecv
		const socket = new net.Socket().setEncoding('utf8');
		let tBegin = 0
		let send = strRand.slice(0, siz)
		socket.connect( to.port, to.host, ()=>{
			send = fSerialize(MsgType_Speed, send)
			tBegin = process.uptime()
			socket.write(send, 'utf8');
		}).on( 'data', function ( msg ) {
			let tEnd = process.uptime()
			bufRecv.DeSerialize(msg, (type, msg) => {
				let result = fSpeedLog(from, to, send.length, tEnd-tBegin)
				socket.destroy()
				resolve(result)
			})
		}).on('error', (e) => {
			reject(e.message)
		});
	})
}

function wait_sync(ms, cb, param) {
	return new Promise((resolve, reject) => {
		setTimeout(async ()=>{
			try{
				let ret = await cb(param)
				resolve(ret)
			} catch (e) {
				reject(e)
			}
		}, ms)
	})
}

function TransNextInfo(info, previousSocket = null) {
	return new Promise((resolve, reject)=>{
		let bufRecv = new TcpBufRecv
		let host = info.host
		let port = info.port || defaultPort
		const socket = new net.Socket().setEncoding('utf8');
		console.log(`TransNextInfo to ${host}:${port}`)
		socket.connect(port, host, ()=>{
			socket.write(fSerialize(MsgType_Info, JSON.stringify(info.next)))
		}).on('data', (msg)=> {
			bufRecv.DeSerialize(msg, (type, msg) => {
				if (previousSocket)
					previousSocket.write(fSerialize(MsgType_Info_Ret, msg), 'utf8')
				else
					console.log(msg)
			})
		}).on('close', ()=>{
			console.log(`TransNextInfo over. test over`)
			previousSocket && previousSocket.end()
			resolve(null)
		}).on('error', (e)=>{
			console.log(`TransNextInfo err ${e}. test over`)
			previousSocket && previousSocket.end()
			resolve(null)
		})
	})
}
