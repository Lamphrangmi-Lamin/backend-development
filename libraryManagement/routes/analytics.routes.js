const express = require("express");
const { getAnalytics } = require("../controllers/analytics.controller");
const { apiKeyMiddleware } = require("../../GlobalLoggerMiddleware/middlewares/apikeyMiddleware");
const router = express.Router();

// ? Create routes
// ** GET /analytics
router.get("/", apiKeyMiddleware, getAnalytics);

module.exports = router