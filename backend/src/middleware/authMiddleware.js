const prisma = require("../prismaClient");

async function authRequired(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || new Date(session.expiresAt) < new Date()) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = session.user;
  req.session = session;
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = {
  authRequired,
  requireRole,
};


