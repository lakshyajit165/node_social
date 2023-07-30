const validateIdToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).send({ message: "Invalid or missing id token" });
	}
	next();
};

const validateAuthorizationCode = (req, res, next) => {
	const authorizationCode = req.query.authorizationCode;
	if (!authorizationCode) {
		return res.status(400).send({
			message: "Invalid authorization code",
		});
	}
	next();
};

module.exports = {
	validateIdToken,
	validateAuthorizationCode,
};
