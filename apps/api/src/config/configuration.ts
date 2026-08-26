export default () => ({
    app: {
        port: parseInt(process.env.PORT ?? '4000', 10),
        environment: process.env.NODE_ENV ?? 'development',
    },

    database: {
        url: process.env.DATABASE_URL,
    },

    redis: {
        url: process.env.REDIS_URL ?? 'redis://localhost:6379',
    },

    auth: {
        accessTokenSecret: process.env.JWT_ACCESS_SECRET,

        accessTokenExpiration: process.env.JWT_ACCESS_EXPIRATION ?? '15m',

        refreshTokenExpiration:
            process.env.JWT_REFRESH_EXPIRATION ?? '7d',

        cookieName:
            process.env.AUTH_COOKIE_NAME ?? 'refresh_token',

        cookieSecure:
            process.env.AUTH_COOKIE_SECURE === 'true',

        cookieSameSite:
            process.env.AUTH_COOKIE_SAME_SITE ?? 'lax',
    },
});