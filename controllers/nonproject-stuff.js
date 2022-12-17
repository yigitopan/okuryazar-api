require('dotenv').config();
const nodemailer = require("nodemailer")


/////////////////

const MindSetEmail = async(req, res, next) => {
    let transporter = nodemailer.createTransport({
        service:'Hotmail',
        auth: {
            user: 'yigitopan@hotmail.com',
            pass: '24y!35aN99',
        }
    })

    var maillist = [
        'e180503017@stud.tau.edu.tr',
        'e180503041@stud.tau.edu.tr'
      ];

    let mailOptions = {
        from: 'yigitopan@hotmail.com',
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
