const dotenv = require("dotenv");
dotenv.config();
module.exports = {
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
	GOOGLE_OAUTH2_TOKEN_ENDPOINT: process.env.GOOGLE_OAUTH2_TOKEN_ENDPOINT,
	DATABASE: process.env.DATABASE,
	DB_USER: process.env.DB_USER,
	DB_HMAC: process.env.DB_HMAC,
	DB_HOST: process.env.DB_HOST,
	DB_PORT: +process.env.DB_PORT,
	DB_DIALECT: process.env.DB_DIALECT,
	DB_POOL_CONNECTION_LIMIT: +process.env.DB_POOL_CONNECTION_LIMIT,
	DB_POOL_IDLE_TIMEOUT: +process.env.DB_POOL_IDLE_TIMEOUT,
	DB_POOL_EVICT: +process.env.DB_POOL_EVICT,
};
