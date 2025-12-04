const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("../prismaClient");

function generateAccessToken() {
  // 36-char random alphanumeric
  return crypto.randomBytes(18).toString("hex").slice(0, 36);
}

async function signup(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "name, email, password and role are required" });
  }

  if (!["CUSTOMER", "BANKER"].includes(role)) {
    return res.status(400).json({ message: "role must be CUSTOMER or BANKER" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashed = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
        // For customers you might want to auto-create an account
        ...(role === "CUSTOMER"
          ? {
              accounts: {
                create: {
                  accountNumber: `ACC-${Date.now()}`,
                  balance: 0,
                },
              },
            }
          : {}),
      },
    });
  } catch (err) {
    // Handle race condition / unique constraint error from Prisma
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Email already in use" });
    }
    throw err;
  }

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

async function login(req, res) {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: "email, password and role are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== role) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateAccessToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = {
  signup,
  login,
};


