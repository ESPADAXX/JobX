const app = require("express")();

const authRoutes = require("./authentication/routes");
const applicationRoutes = require("./application/routes");
const messageRoutes = require("./message/routes");
const userRoutes = require("./user/routes");

app.use("/auth", authRoutes);
app.use("/application", applicationRoutes);
app.use("/message", messageRoutes);
app.use("/user", userRoutes);

module.exports = app;