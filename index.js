const express = require("express");
require("dotenv").config();
const { dbConnection } = require("./config/config");
const app = express();
const cors = require("cors");
const { handleTypeError } = require("./middleware/errors");
const PORT = process.env.PORT || 3001;

dbConnection();

app.use(express.json());
app.use(cors());
app.use("/users", require("./routes/users"));

app.use("/doubts", require("./routes/doubts"));

app.use("/answers", require("./routes/answers"));

app.use(handleTypeError);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
