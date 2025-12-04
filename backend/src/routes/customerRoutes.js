const express = require("express");
const {
  getMyAccounts,
  getMyTransactions,
  deposit,
  withdraw,
} = require("../controllers/customerController");
const { authRequired, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authRequired, requireRole("CUSTOMER"));

router.get("/accounts", getMyAccounts);
router.get("/accounts/:accountId", getMyTransactions);
router.post("/accounts/:accountId/deposit", deposit);
router.post("/accounts/:accountId/withdraw", withdraw);

module.exports = router;


