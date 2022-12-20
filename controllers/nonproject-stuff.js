require('dotenv').config();
const nodemailer = require("nodemailer")


/////////////////

const MindSetEmail = async(req, res, next) => {
    let transporter = nodemailer.createTransport({
        service:'Hotmail',
        auth: {
            user: 'e180503041@stud.tau.edu.tr',
            pass: process.env.MAILPASS
        }
    })

    var maillist = [
        'yigitmert35@gmail.com',
        'yigitopan@hotmail.com'
      ];

    let mailOptions = {
        from: 'e180503041@stud.tau.edu.tr',
        to: maillist,
        subject: 'Taupay - Hoşgeldin',
        html: '<h1>Taupay beta sürümü üyesisin!</h1> <p>Hizmetlerimiz çok yakında genişlemeye başlayacak. Takipte kal :)</p>',
    }

    transporter.sendMail(mailOptions, (err,data) => {
        if(err) console.log(err)
        else console.log('ok')
    })
}


module.exports = {
    MindSetEmail
} 
