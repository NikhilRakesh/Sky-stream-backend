import dotenv from "dotenv";
import nodemailer from "nodemailer";


dotenv.config()


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


export const message = (recipientMail,Subject,html) =>{
    let  message 
    return (message = {
      from: process.env.EMAIL, // Sender address
      to: recipientMail, // List of recipients
      subject: Subject, // Subject line
      text: "Hello, this is a test email sent from Node.js using Nodemailer!", //TODO correct message,
      html: html,
    });

}

export const cb = (error, info)=>{
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent:'+ info.response);
    }
}








