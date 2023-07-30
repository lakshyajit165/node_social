const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_OAUTH2_TOKEN_ENDPOINT } = require("../configuration/envConfig");
const { google } = require("googleapis");
const axios = require("axios");
const querystring = require("node:querystring");
const models = require("../models/index");
const User = models.User;
const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID, //"your_client_id",
	GOOGLE_CLIENT_SECRET, //"your_client_secret",
	GOOGLE_REDIRECT_URI // client side "your_redirect_url");
);

const userSignUp = async (req, res) => {
	const authHeader = req.headers.authorization;
	const token = authHeader.split(" ")[1];

	// Verify the Google token
	oauth2Client
		.verifyIdToken({ idToken: token })
		.then(async (oauth2ClientVerifyIdTokenResult) => {
			const payload = oauth2ClientVerifyIdTokenResult.getPayload();
			const email = payload.email;

			// Check if the user already exists in the database
			const existingUser = await User.findOne({ where: { email } });
			if (existingUser) {
				return res.status(409).send({ message: "User already exists" });
			}

			// Create a new user with the role 'user'
			await createUser(payload);

			return res.status(200).send({ message: "Google sign up successful" });
		})
		.catch((err) => {
			return res.status(400).send({ message: err && err.message ? err.message : "Invalid Google token" });
		});
};

const userLogin = async (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).send({ message: "Invalid or missing id token" });
	}
	const token = authHeader.split(" ")[1];

	// Verify the Google token
	oauth2Client
		.verifyIdToken({ idToken: token })
		.then(async (oauth2ClientVerifyIdTokenResult) => {
			const payload = oauth2ClientVerifyIdTokenResult.getPayload();
			const email = payload.email;
			// Check if the user exists in the database
			const user = await User.findOne({ where: { email: email } });
			if (!user) {
				/**
				 * create a user, just like signup flow, because
				 * that's typically how google login works
				 */
				await createUser(payload);
			}

			return res.status(200).send({ message: "Google sign in successful" });
		})
		.catch((err) => {
			return res.status(400).send({ message: err && err.message ? err.message : "Invalid Google token" });
		});
};

const testServerResponse = (req, res) => {
	return res.status(200).send({ message: "Testing server response" });
};

const oauthTokenExchange = async (req, res) => {
	const authorizationCode = req.query.authorizationCode;
	/**
	 * 1. Call function for token exchange
	 * 2. Get the accessToken, refreshToken and expiryTime
	 * 3. Encrypt the tokens and send it to client in response body.
	 * 4. Client can use the same decrypting mechanism to decrypt and store the tokens
	 */
	try {
		const { accessToken, idToken, expiresIn } = await exchangeAuthorizationCodeForTokens(authorizationCode);
		return res.status(200).send({
			acc_tk: accessToken,
			id_tk: idToken,
			exp: expiresIn,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			message: "Error while verifying authorization code | " + err && err.message ? err.message : "",
		});
	}
};

async function createUser(payload) {
	/**
	 * creates a user in the db
	 * Role's logic to be defined later
	 */
	await User.create({ email: payload.email, role: "user", avatar_url: payload.picture });
}

async function exchangeAuthorizationCodeForTokens(code) {
	/**
	 * Typically we don't need a refresh token because
	 * in any application using Oauth2(Google in this case), you are
	 * logged out of the application if you logout of Google.
	 * So only accessToken and idToken are fine.
	 */
	const tokenEndpoint = GOOGLE_OAUTH2_TOKEN_ENDPOINT;
	const requestBody = {
		code: code,
		client_id: GOOGLE_CLIENT_ID, // client id
		client_secret: GOOGLE_CLIENT_SECRET, //"your_client_secret",
		/**
		 * The redirect uri needs to be same as defined on the client side
		 * otherwise the signin/signup flow throws a "redirect uri mismatch" error
		 * Note: Passing the redirect uri here on the server side doesn't serve any
		 * other purpose other than a "configuration parameter"
		 */
		redirect_uri: GOOGLE_REDIRECT_URI,
		grant_type: "authorization_code",
	};
	const response = await axios.post(tokenEndpoint, querystring.stringify(requestBody));
	const { access_token, id_token, expires_in } = response.data;
	return {
		accessToken: access_token,
		idToken: id_token,
		expiresIn: expires_in,
	};
}

module.exports = {
	userLogin,
	userSignUp,
	oauthTokenExchange,
	testServerResponse,
};
