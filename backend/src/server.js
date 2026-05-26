require("dotenv").config();
const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/category.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/categories", categoryRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

// Health check
app.get("/", (req, res) => res.json({ status: "Funfa" }));

// Middleware de erro global no final do arquivo
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {console.log(`Servidor rodando na porta ${PORT}`)});
