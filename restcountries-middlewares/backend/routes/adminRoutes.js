const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const {
  listUsers,
  generateApiKey,
  deleteApiKey,
  updateUsage,
} = require("../controllers/adminController");

router.use(authMiddleware, isAdmin);

router.get("/users", listUsers);
router.post("/:userId/generate", generateApiKey);
router.delete("/:userId", deleteApiKey);
router.put("/:userId/usage", updateUsage);

module.exports = router;
