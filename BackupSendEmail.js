const fs = require( 'fs' )
const exec = require('util').promisify(require('child_process').exec);
const archiver = require('archiver');
const nodemailer = require("nodemailer");

// 服务器的名字 用于标识不同的备份
let packPath = '/tmp/'
let packName = 'backup.zip'
// 要备份的数据库
let bak_dbs = [""]
// 要备份的文件夹
let bak_dirs = ['']
// 邮件发送者 下面用outlook的配置举例
let emailSender = {
	auth: {
		user:"user@user.com",
		pass:"password",
	},
	host:'smtp.office365.com',
	port: 587,
	secure: false
}
let emailTo = {
	from: emailSender.auth.user,
	to: "to",
	subject: "subject",
	html : "html",
}

// -----------------------------------------------------
// 备份
async function backup() {
	let output = fs.createWriteStream(`${packPath}${packName}`);
	let archive = archiver('zip');

	archive.pipe(output);

	// 备份数据库
	for(let i = 0; i < bak_dbs.length; ++i) {
		let fileName = `${bak_dbs[i]}.sql`
		await exec(`/usr/bin/mysqldump -uroot -p123456 ${bak_dbs[i]} > ${packPath}/${fileName}`)
		archive.append(fs.createReadStream(`${packPath}/${fileName}`), {name:fileName})
	}

	// 备份文件夹
	for(let i = 0; i < bak_dirs.length; ++i) {
		let dir = bak_dirs[i]
		archive.directory(dir, true)
	}
	await archive.finalize();
}

async function SendEmail() {
	let transporter = nodemailer.createTransport(emailSender)
	emailTo.attachments=[{
		filename:packName,
		path:`${packPath}${packName}`,
	}]
	let r = await transporter.sendMail(emailTo)
	if(r.accepted.length) {
		console.log(`email sent success. to ${r.accepted[0]}`);
	} else if(r.rejected.length) {
		console.error('----------------------------->')
		console.error(`email sent failed. to ${r.rejected[0]}. now ${new Date().toLocaleString()}`);
		console.error(r.response)
		console.error('----------------------------->')
	}
}

setTimeout(async () => {
	try {
		await backup()
		await SendEmail()
	} catch(e) {
		console.log(e)
	}
}, 100)



setInterval(async () => {
	try {
		await backup()
		await SendEmail()
	} catch(e) {
		console.log(e)
	}
}, 1000 * 3600 * 24)
