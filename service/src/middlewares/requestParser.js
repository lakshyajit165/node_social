const { google } = require("googleapis");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_OAUTH2_TOKEN_ENDPOINT } = require("../configuration/envConfig");
const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID, //"your_client_id",
	GOOGLE_CLIENT_SECRET, //"your_client_secret",
	GOOGLE_REDIRECT_URI // client side "your_redirect_url");
);

const verifyIdTokenPresent = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).send({ message: "Invalid or missing id token" });
	}
	next();
};

const validateTokenWithOAuthProvider = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader.split(" ")[1];
	// Verify the Google token
	try {
		const oauth2ClientVerifyIdTokenResult = await oauth2Client.verifyIdToken({ idToken: token });
		const payload = oauth2ClientVerifyIdTokenResult.getPayload();
		if (!payload || !payload.email) {
			return res.status(500).send({ message: err && err.message ? err.message : "could not validate token from oauth provider" });
		}
		req.body.payload = payload;
		next();
	} catch (err) {
		return res.status(400).send({ message: err && err.message ? err.message : "invalid google token" });
	}
};

const validateAuthorizationCode = (req, res, next) => {
	const authorizationCode = req.query.authorizationCode;
	if (!authorizationCode) {
		return res.status(400).send({
			message: "invalid authorization code",
		});
	}
	next();
};

module.exports = {
	verifyIdTokenPresent,
	validateAuthorizationCode,
	validateTokenWithOAuthProvider,
};
