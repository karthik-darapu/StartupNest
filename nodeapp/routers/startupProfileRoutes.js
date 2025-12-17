const express = require("express");
const router = express.Router();
const {
  addStartupProfile,
  getAllStartupProfiles,
  getStartupProfileById,
  getStartupProfilesByMentorId,
  updateStartupProfile,
  deleteStartupProfile,
} = require("../controllers/startupProfileController");

const {  authorizeRole } = require("../authUtils");

router.get("/getAllStartupProfiles", authorizeRole("Entrepreneur") ,getAllStartupProfiles);

router.post(
  "/addStartupProfile",
  
  authorizeRole("Mentor"),
  addStartupProfile
);
router.get(
  "/getStartupProfileById/:id",
  
  authorizeRole("Entrepreneur"),
  getStartupProfileById
);
router.get(
  "/getStartupProfilesByMentorId/:mentorId",
  
  authorizeRole("Mentor"),
  getStartupProfilesByMentorId
);
router.put(
  "/updateStartupProfile/:id",
  
  authorizeRole("Mentor"),
  updateStartupProfile
);
router.delete(
  "/deleteStartupProfile/:id",
  
  authorizeRole("Mentor"),
  deleteStartupProfile
);
router.get(
  "/getAllPublicStartupProfiles",
  
  authorizeRole("Entrepreneur"),
  getAllStartupProfiles
);


module.exports = router;

