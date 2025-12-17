const express = require("express");
const router = express.Router();
const {
  addStartupSubmission,
  getAllStartupSubmissions,
  updateStartupSubmission,
  deleteStartupSubmission,
  getSubmissionFile,
  getSubmissionsByUserId,
} = require("../controllers/startupSubmissionController");

const {  authorizeRole } = require("../authUtils");


router.post(
  "/addStartupSubmission",
  authorizeRole("Entrepreneur"),
  addStartupSubmission
);

router.get(
  "/getSubmissionsByUserId/:userId",
  authorizeRole("Entrepreneur"),
  getSubmissionsByUserId
);

router.delete(
  "/deleteStartupSubmission/:id",
  authorizeRole("Entrepreneur"),
  deleteStartupSubmission
);

router.get(
  "/getAllStartupSubmissions",
  authorizeRole("Mentor"),
  getAllStartupSubmissions
);

router.get(
  "/getSubmissionFile/:id",
  getSubmissionFile

);

router.put(
  "/updateStartupSubmission/:id",
  authorizeRole("Mentor"),
  updateStartupSubmission
);

module.exports = router;


