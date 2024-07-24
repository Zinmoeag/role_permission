import nodemailer from "nodemailer";
import AppConfig from "../../config";
import pug from 'pug' 
import {convert} from "html-to-text";
import AppError, { errorKinds } from "../../utils/AppError";
import { Result, returnStates } from "../../types";

abstract class Email<T extends object>{

    abstract viewFileName : string;
    abstract mailObject : T;
    abstract subject : any;

    abstract name : string;
    abstract to : string;
    abstract from : string;

    private readonly username = AppConfig.getConfig("EMAIL_USER")
    private readonly password = AppConfig.getConfig("EMAIL_PASSWORD")
    private readonly host = AppConfig.getConfig("EMAIL_SMTP_HOST")
    private readonly port  = AppConfig.getConfig("EMAIL_SMTP_PORT")
    private readonly viewPath = `${__dirname}/../../views/`;

    private newTransport(){
        return nodemailer.createTransport({
            host: this.host,
            port: Number(this.port),
            secure: false, // use TLS
            auth: {
              user: this.username,
              pass: this.password,
            },
            // tls: {
            //   // do not fail on invalid certs
            //   rejectUnauthorized: false,
            // },
          })
    }

    public async send() : Promise<Result<any, any>> {
      const html = pug.renderFile(this.viewPath + this.viewFileName + `.pug`, this.mailObject);

      try{
        const mailOptions = {
          from: this.from,
          to: this.to,
          subject : this.subject,
          text: convert(html),
          html,
        };
    
        // Send email
        const info = await this.newTransport().sendMail(mailOptions);
        console.log(nodemailer.getTestMessageUrl(info))

        return {
          state : returnStates.SUCCESS,
          payload : {
            mainInfo : info
          }
        }

      }catch(err){
        return {
          state : "FAILED",
          errorKind : errorKinds.mailboxUnavailable,
          message : "Mail box Available",
          errors : null
        };
      }
      // Create mailOptions
    }
}  

export default Email;