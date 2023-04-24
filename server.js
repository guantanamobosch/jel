const express = require("express");
const path = require("path");
const logger = require("morgan");
// Always require and configure near the top
require("dotenv").config();
// Connect to the database
require("./config/database");

const app = express();

app.use(logger("dev"));
app.use(express.json());

// Configure both serve-favicon & static middleware
// to serve from the production 'build' folder
app.use(express.static(path.join(__dirname, "build")));
app.use(require("./config/checkToken"));

const port = process.env.PORT || 3001;

// Put API routes here, before the "catch all" route
app.use("/api/users", require("./routes/api/users"));

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX/API requests
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

const server = app.listen(port, function () {
    console.log(`Express app running on port ${port}`);
});

const io = require("./config/socket").init(server);

io.on("connection", (socket) => {
    console.log("user has connected");
    socket.on("disconnect", () => {
        console.log("user has disconnected");
    });
});
