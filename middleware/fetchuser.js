const jwt = require('jsonwebtoken');
const jwtSecret = "nighthacks"

const fetchuser = async (req, res, next) => {
    let authtoken = req.header("auth-token");
    if (!authtoken) {
        res.status(401).json({ error: "unauthorised access" });
    }
    let data = await jwt.verify(authtoken,jwtSecret);
    req.user=data.userId;
    next();
}

module.exports = fetchuser;