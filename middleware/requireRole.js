const requireRole = (...allowedRoles) => (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
        return res.status(403).json({ error: 'Forbidden.' });
    }

    next();
};

export default requireRole;
