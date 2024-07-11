const applicationConfig = {
    appUrl : process.env.APP_URL,
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

} as const;

export type configType = typeof applicationConfig[keyof typeof applicationConfig]

export default applicationConfig;