const express = require("express");
const { dbConnection } = require("./config/config");
const app = express();
const PORT = 3000;

dbConnection();

app.use(express.json());

app.use("/usuarios", require("./routes/usuarios"));

app.use("/queries", require("./routes/queries"));

app.listen(PORT, () => console.log(`Servidor levantado en el puerto ${PORT}`));

module.exports = app;
