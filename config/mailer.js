if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const nodemailer = require("nodemailer")

async function sendRecoveryEmail(user) {
    const domain = process.env.DOMAIN_URL || "http://localhost:3031"
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            // TODO - make sure to include this configs to prod env variables. Also add DOMAIN_URL to prod env for the email.
            user: `${process.env.NODEMAILER_EMAIL_ADDRESS}`,
            pass: `${process.env.NODEMAILER_EMAIL_PASSWORD}`,
        },
    })

    const mailOptions = {
        from: `${process.env.NODEMAILER_EMAIL_ADDRESS}`,
        to: `${user.email}`,
        subject: "CurtainCo Link To Reset Password",
        text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
            `${domain}/reset/${user.resetPasswordToken}\n\n` +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    }

    console.log("sending mail")

    const nodeMailerResponse = await transporter
        .sendMail(mailOptions, (err, response) => {
            if (err) {
                console.log("error: ", err)
                throw new Error(err)
            }
            console.log("success: ", response)
            return response
            // e.g. response
            // {
            //     accepted: [ 'simosultan2020@gmail.com' ],
            //     rejected: [],
            //     envelopeTime: 955,
            //     messageTime: 867,
            //     messageSize: 738,
            //     response: '250 2.0.0 OK  1636273132 hg4sm13335051pjb.1 - gsmtp',
            //     envelope: {
            //         from: 'donotreply.curtainco@gmail.com',
            //         to: [ 'simosultan2020@gmail.com' ]
            //     },
            //     messageId: '<98becbda-4f17-4a25-fe3d-51fedee0526f@gmail.com>'
            // }
        })
        .then((resp) => {
            return resp
        })
    return nodeMailerResponse
}

module.exports = {
    sendRecoveryEmail,
}
