const getToken = (req) => {
    const authHeadres = req.headers.authorization;
    const token = authHeadres.split(' ')[1];

    return token;
};

module.exports = getToken;