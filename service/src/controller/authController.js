const express = require("express");
const { userSignUp, userLogin, oauthTokenExchange } = require("../service/userService");
const { validateIdToken, validateAuthorizationCode } = require("../middlewares/requestParser");
const router = express.Router();

// Google Sign Up
router.post("/auth/google/signup", [validateIdToken], userSignUp);

// Google Sign In
router.post("/auth/google/login", [validateIdToken], userLogin);

router.get("/auth/google/tokenExchange", [validateAuthorizationCode], oauthTokenExchange);

module.exports = router;
