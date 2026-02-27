const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobControllers");

const router = express.Router();

router.get("/", getAllJobs);
router.get("/:id", getJob);

router.post("/", requireAuth, createJob);
router.put("/:id", requireAuth, updateJob);
router.patch("/:id", requireAuth, updateJob);
router.delete("/:id", requireAuth, deleteJob);

module.exports = router;
