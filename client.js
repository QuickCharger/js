let net = require('net')

clientSocket1= net.connect(12345, "127.0.0.1");
clientSocket1
.on('close', ()=>{
	console.log(`client close`)
}).on('connect', ()=>{
	console.log(`client connect`)
	clientSocket1.write("qwer")
}).on('data', data =>{
	console.log(`client data. send from server: ${data}`)
}).on('drain', ()=>{
	console.log(`client drain`)
}).on('end', ()=>{
	console.log(`client end`)
}).on('error', ()=>{
	console.log(`client error`)
}).on('lookup', ()=>{
	console.log(`client lookup`)
}).on('timeout', ()=>{
	console.log(`client timeout`)
})

setTimeout(()=>{
	clientSocket1.end()
}, 5000)
