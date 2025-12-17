const express = require("express");
const router = express.Router();

const userRoutes = require("./userRouter");
const startupProfileRoutes = require("./startupProfileRoutes");
const startupSubmissionRoutes = require("./startupSubmissionRoutes");
const { validateToken } = require("../authUtils");

router.use("/user", userRoutes);

router.use("/startupProfile", validateToken,startupProfileRoutes);

router.use("/startupSubmission",validateToken, startupSubmissionRoutes);

module.exports = router;
