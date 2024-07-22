import Email from "./email";
import { Mailer } from "./type";

type MailObj = {
    url : string
}

class VerifyEmail extends Email<MailObj> {   
    //rendering file
    viewFileName  = "verificationCode";
    mailObject : MailObj;

    to;
    from;
    //mailObject
    name;
    subject = "verification code";
    
    constructor ({
        name, 
        to, 
        from, 
        mailObj
    } : Mailer<MailObj>) {
        super();
        this.name = name;
        this.to = to;
        this.from = from;
        this.mailObject = mailObj;
    }
}

export default VerifyEmail;