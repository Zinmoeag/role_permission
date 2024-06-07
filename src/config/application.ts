const applicationConfig = {
    appUrl : process.env.APP_URL,
    jwtSecretKey : process.env.JWT_SECRET_KEY,

    ACCESS_TOKEN_PRIVATE_KEY : process.env.ACCESS_TOKEN_PRIVATE_KEY,
    REFRESH_TOKEN_PRIVATE_KEY : process.env.REFRESH_TOKEN_PRIVATE_KEY,

    ACCESS_TOKEN_PUBLIC_KEY : process.env.ACCESS_TOKEN_PUBLIC_KEY,
    REFRESH_TOKEN_PUBLIC_KEY : process.env.REFRESH_TOKEN_PUBLIC_KEY,
};

export default applicationConfig;