const express = require("express");
const {
  listCustomers,
  getCustomerAccounts,
} = require("../controllers/bankerController");
const { authRequired, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authRequired, requireRole("BANKER"));

router.get("/customers", listCustomers);
router.get("/customers/:userId/accounts", getCustomerAccounts);

module.exports = router;


