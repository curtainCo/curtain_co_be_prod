if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const nodemailer = require("nodemailer")

async function sendRecoveryEmail(user) {
    return await wrappedRecoveryEmail(user)
}

function wrappedRecoveryEmail(user) {
    const domain =
        process.env.NODE_ENV === "test"
            ? "http://localhost:3000"
            : process.env.DOMAIN_URL || "http://localhost:3000"

    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                // TODO - make sure to include this configs to prod env variables. Also add DOMAIN_URL to prod env for the email.
                user: `${process.env.NODEMAILER_EMAIL}`,
                pass: `${process.env.NODEMAILER_PASSWORD}`,
            },
        })

        const mailOptions = {
            from: `${process.env.NODEMAILER_EMAIL}`,
            to: `${user.email}`,
            subject: "Link To Reset Password",
            text:
                "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                "Please click on the following link, or paste this into your browser:\n\n" +
                `${domain}/reset-password/${user.resetPasswordToken}\n\n` +
                "This link will expire in <strong>1 hour</strong>.\n\n" +
                "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        }
        console.log("sending mail")

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.log("error sending mail: ", err)
                reject(err)
            }
            console.log("successfully sent mail")
            resolve(response)
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
    })
}

module.exports = {
    sendRecoveryEmail,
}
