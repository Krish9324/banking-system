const prisma = require("../prismaClient");

async function listCustomers(req, res) {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      accounts: true,
    },
  });
  res.json(customers);
}

async function getCustomerAccounts(req, res) {
  const { userId } = req.params;
  const customer = await prisma.user.findFirst({
    where: { id: Number(userId), role: "CUSTOMER" },
    include: {
      accounts: {
        include: { transactions: { orderBy: { createdAt: "desc" } } },
      },
    },
  });
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.json(customer);
}

module.exports = {
  listCustomers,
  getCustomerAccounts,
};


