function Fill(a_context, a_length, a_fill='0', a_left=true) {
    let ret = a_context.toString()
    if(a_left) {
        for(let i = ret.length; i < a_length; ++i) {
            ret = a_fill + ret
        }
    } else {
        for(let i = ret.length; i < a_length; ++i) {
            ret += a_fill
        }
    }
    return ret
}

const PLACEHOLDERLENGTH=10
const TYPEHOLDERLENGTH=4
const HOLDERLENGTH = PLACEHOLDERLENGTH + TYPEHOLDERLENGTH

const MsgType = {
	speed: "sped",
	info: "info",
	over: "over",
	report: "rprt",
}

class TcpBufRecv {
	constructor() {
		this.Buf = ""
		this.BufSize = 0
	}

	DeSerialize(a_Buf, a_CB, a_DeWrap, a_Repeat = 999) {
		let beginPos = 0
		let endPos = 0
		let bufLeft = a_Buf.length
		while(a_Repeat-- > 0) {		// 小心a_Repeat结束Buf没读完的情况

			// 先填充到14个长度
			let needLength = HOLDERLENGTH - this.Buf.length
			needLength = needLength > 0 ? needLength : 0
			if(needLength > 0) {
				this.Buf += a_Buf.slice(beginPos, beginPos + needLength)
			}
			if(this.Buf.length < HOLDERLENGTH)
				return
			let packLength = +this.Buf.slice(0, 10)
			let msgType = this.Buf.slice(10, 14)
			let realPackLength = a_Buf.length - needLength

			if(msgType === speed) {
				if(packLength < realPackLength) {
					this.Buf = ""
					this.BufSize = 0
					continue
				} else {
					this.BufSize += realPackLength
					return
				}
			} else if(msgType === info || msgType === over || msgType === report) {

			} else {

			}
		}
	}
}

// 114=10+4+100
class TcpBufSend {
	constructor(a_type, a_context = '') {
		this.type = a_type
		this.context = a_context.toString()
	}

	Serialize(wrap) {
		if(typeof wrap === "function") {
			this.context = wrap(this.context)
		} else if(wrap === "base64") {
			this.context = Buffer.from(this.context).toString('base64')
		}
		return Fill(HOLDERLENGTH + this.context.length, PLACEHOLDERLENGTH) + this.type + this.context
	}
}

function Rand(a_Min=0, a_MaxNotInclude=100) {
	return Math.floor(Math.random()*(a_MaxNotInclude-a_Min)) + a_Min
}

function RandString(a_Length, a_CharSet='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
	ret = ''
	for(let i = 0; i < a_Length; ++i) {
		let rand = Rand(0, a_CharSet.length)
		ret += a_CharSet.charAt(rand)
	}
	return ret
}

module.exports={Fill, MsgType,
	Rand, RandString,
	TcpBufSend, TcpBufRecv}

if (require.main === module) {
	console.log(Fill(123, 10))
	let buf = new TcpBufSend("abcdefg").Serialize()
	console.log(buf)

	let bufbuf = buf + buf
	let deBuf = new TcpBufRecv
	deBuf.DeSerialize(bufbuf, e => console.log(e))

	for(let i=0; i< 100; ++i) {
		console.log(Rand(0,10))
	}
	console.log(RandString(100))
}
