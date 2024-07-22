export type Mailer<T> = {
    name : string,
    to : string,
    from : string,
    mailObj : T
}