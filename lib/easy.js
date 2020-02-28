function Fill(a_context, a_length, a_fill='0', a_left=true) {
    ret = a_context.toString()
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

class TcpBufRecv {
    constructor() {
        this.Buf = ""
    }

    DeSerialize(a_Buf, a_CB, a_DeWrap, a_Count = 999){
        if(a_Buf)
            this.Buf += a_Buf
        for(a_Count; a_Count > 0; --a_Count) {
            if(this.Buf.length < PLACEHOLDERLENGTH)
                return
            let packSize = +this.Buf.slice(0, PLACEHOLDERLENGTH)
            if(isNaN(packSize) || packSize > (this.Buf.length - PLACEHOLDERLENGTH))
                return
            if(a_CB) {
                let data = this.Buf.slice(PLACEHOLDERLENGTH, packSize + PLACEHOLDERLENGTH)
                data = a_DeWrap ? a_DeWrap(data) : Buffer.from(data, 'base64').toString('utf8');
                a_CB(data)
            }
            this.Buf = this.Buf.slice(packSize + PLACEHOLDERLENGTH)
        }
    }
}

class TcpBufSend {
    constructor(a_context) {
        this.context = a_context.toString()
    }

    Serialize(wrap) {
        this.context = wrap ? wrap(this.context) :  Buffer.from(this.context).toString('base64')
        return Fill(this.context.length, PLACEHOLDERLENGTH) + this.context
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

module.exports={Fill,
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
