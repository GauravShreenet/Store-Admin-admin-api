import nodemailer from 'nodemailer';
//smtp configuration


//email body

//send email

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const emailSender = async (obj) =>{
    try {
        const info = await transporter.sendMail(obj);
        console.log("Message sent: %s", info.messageId) 
    } catch (error) {
        console.log(error)
    }
}

export const sendEmailVerificaitonLinkEmail = ({ email, fName, url }) => {
    const body = 
    {
        from: `"Fashon 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Follow the instruction to verify your account", // Subject line
        text: `Hello ${fName}, please follow the link to verify your account ${url} \n\n Regards, Fashon`, // plain text body
        html: `<p>Hello ${fName}</p>
        <br /><br />
        
        <p>Thank you for creating account with us. Click the Button to verify your account.</p>
        <p>
        if the above button doesnt work, copy paste the following
            <a href="${url}">
                <button style="background: green; padding: 2rem; color: white; font-weight: bolder">Verify</button>
            </a>
        </p>
        <br /><br /><br />
        ------------------
        <p>
            Regards,
            <br />
            Fashon
            <br />
            www.fashon.com
        </p>`, // html body
      }

      emailSender(body)
}

export const sendEmailVerifiedNotifaction = ({ email, fName }) => {
    const body = 
    {
        from: `"Fashon 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Your email have been verified", // Subject line
        text: `Hello ${fName}, Your email has been verified \n\n Regards, Fashon`, // plain text body
        html: `<p>Hello ${fName}</p>
        <br /><br />
        
        <p>Your email has been verified. You can login now</p>
        
        <br /><br /><br />
        ------------------
        <p>
            Regards,
            <br />
            Fashon
            <br />
            www.fashon.com
        </p>`, // html body
      }

      emailSender(body)
}

