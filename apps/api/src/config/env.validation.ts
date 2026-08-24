import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'test', 'production')
        .default('development'),

    PORT: Joi.number()
        .port()
        .default(4000),

    DATABASE_URL: Joi.string()
        .uri()
        .required(),

    REDIS_URL: Joi.string()
        .uri()
        .default('redis://localhost:6379'),

    JWT_ACCESS_SECRET: Joi.string()
        .min(32)
        .required(),

    JWT_ACCESS_EXPIRATION: Joi.string()
        .default('15m'),

    JWT_REFRESH_EXPIRATION: Joi.string()
        .default('7d'),
});