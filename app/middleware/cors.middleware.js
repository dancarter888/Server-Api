exports.allowCrossOriginRequestsMiddleware = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    next();
};



exports.loginRequired = async function (req, res, next) {
    const token = req.header('X-Authorization');

    const result = await findUserIdByToken(token);
    if (result === null) {
        res.statusMessage = "Unauthorized";
        res.status(401)
            .send();
    } else {
        req.authenticatedUserId = result.user_id.toString();
        next();
    }
};