const prisma = require("../prismaClient");

async function getMyAccounts(req, res) {
  const accounts = await prisma.account.findMany({
    where: { userId: req.user.id },
    include: { transactions: { orderBy: { createdAt: "desc" } } },
  });
  res.json(accounts);
}

async function getMyTransactions(req, res) {
  const { accountId } = req.params;
  const account = await prisma.account.findFirst({
    where: { id: Number(accountId), userId: req.user.id },
    include: { transactions: { orderBy: { createdAt: "desc" } } },
  });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }
  res.json(account);
}

async function deposit(req, res) {
  const { accountId } = req.params;
  const { amount } = req.body;
  const value = Number(amount);
  if (!amount || value <= 0) {
    return res.status(400).json({ message: "Amount must be positive" });
  }

  const account = await prisma.account.findFirst({
    where: { id: Number(accountId), userId: req.user.id },
  });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const currentBalance = Number(account.balance);
    const acc = await tx.account.update({
      where: { id: account.id },
      data: {
        balance: currentBalance + value,
        transactions: {
          create: { type: "DEPOSIT", amount: value },
        },
      },
      include: { transactions: { orderBy: { createdAt: "desc" } } },
    });
    return acc;
  });

  res.json(updated);
}

async function withdraw(req, res) {
  const { accountId } = req.params;
  const { amount } = req.body;
  const value = Number(amount);
  if (!amount || value <= 0) {
    return res.status(400).json({ message: "Amount must be positive" });
  }

  const account = await prisma.account.findFirst({
    where: { id: Number(accountId), userId: req.user.id },
  });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  if (Number(account.balance) < value) {
    return res.status(400).json({ message: "Insufficient Funds" });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const currentBalance = Number(account.balance);
    const acc = await tx.account.update({
      where: { id: account.id },
      data: {
        balance: currentBalance - value,
        transactions: {
          create: { type: "WITHDRAW", amount: value },
        },
      },
      include: { transactions: { orderBy: { createdAt: "desc" } } },
    });
    return acc;
  });

  res.json(updated);
}

module.exports = {
  getMyAccounts,
  getMyTransactions,
  deposit,
  withdraw,
};


