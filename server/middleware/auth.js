const jwt = require("jsonwebtoken");
require("dotenv").config();

//SE OCUPA DE VERIFICAREA TOKENURILOR 
module.exports = function(req, res, next) {
    
    const jwtToken = req.header("token");

    if (!jwtToken) {
    return res.status(403).json( "Not Authorized");
    }

    try {
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    req.user = payload.user;
    next();
    
    } 
    
    catch (err) {
    res.status(401).json( "Token is not valid" );
    }
};
