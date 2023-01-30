const managerRoutes = require("./routes/manager");
const quizRoutes = require("./routes/quiz");
const userRoutes = require("./routes/user");
const sessionTableRoutes = require("./routes/sessionTable");

const setupRoutes = (app) => {
    app.use(managerRoutes);
    app.use(quizRoutes);
    app.use(userRoutes);
    app.use(sessionTableRoutes);
}

module.exports = setupRoutes;