module.exports = (api) => {
    api.actions = {
        auth: require('./auth')(api),
        users: require('./users/crud')(api),
        games: require('./games/crud')(api),
        comment: require('./comment/crud')(api)
    };
};
