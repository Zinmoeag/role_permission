export const applicationConfig = {
    appUrl : process.env.APP_URL,
    CLIENT_URL : "http://localhost:4000/",
    jwtSecretKey : process.env.JWT_SECRET_KEY,

    ACCESS_TOKEN_PRIVATE_KEY : process.env.ACCESS_TOKEN_PRIVATE_KEY,
    REFRESH_TOKEN_PRIVATE_KEY : process.env.REFRESH_TOKEN_PRIVATE_KEY,

    ACCESS_TOKEN_PUBLIC_KEY : process.env.ACCESS_TOKEN_PUBLIC_KEY,
    REFRESH_TOKEN_PUBLIC_KEY : process.env.REFRESH_TOKEN_PUBLIC_KEY,

    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL : process.env.GOOGLE_REDIRECT_URL,

    GITHUB_CLIENT_ID : process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET : process.env.GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URL : process.env.GITHUB_REDIRECT_URL,

    EMAIL_USER : process.env.EMAIL_USER,
    EMAIL_PASSWORD : process.env.EMAIL_PASSWORD,
    EMAIL_SMTP_HOST  : process.env.EMAIL_SMTP_HOST,
    EMAIL_SMTP_PORT : process.env.EMAIL_SMTP_PORT,
    ADMIN_EMAIL_ADDRESS : process.env.ADMIN_EMAIL_ADDRESS,

} as const;

export type configType = typeof applicationConfig[keyof typeof applicationConfig]

export default applicationConfig;