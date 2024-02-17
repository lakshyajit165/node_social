const express = require("express");
const { userSignUp, userLogin, oauthTokenExchange, getAdminContents, getUserContents } = require("../service/userService");
const { verifyIdTokenPresent, validateAuthorizationCode, validateTokenWithOAuthProvider } = require("../middlewares/requestParser");
const router = express.Router();

// Google Sign Up
router.post("/auth/google/signup", [verifyIdTokenPresent, validateTokenWithOAuthProvider], userSignUp);

// Google Sign In
router.post("/auth/google/login", [verifyIdTokenPresent, validateTokenWithOAuthProvider], userLogin);

router.get("/auth/google/tokenExchange", [validateAuthorizationCode], oauthTokenExchange);

router.get("/auth/admin/dashboard", getAdminContents);

router.get("/auth/user/dashboard", getUserContents);

module.exports = router;
