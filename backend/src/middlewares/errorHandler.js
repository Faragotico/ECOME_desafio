// Middleware global de tratamento de erros
function errorHandler(err, req, res, next) {
  console.error(err);

  // Erros do Zod (validação de entrada)
  if (err.name === "ZodError") {
    return res.status(422).json({
      error: "Dados inválidos",
      details: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Prisma: registro não encontrado
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Registro não encontrado" });
  }

  // Prisma: violação de chave estrangeira
  if (err.code === "P2003") {
    return res.status(400).json({ error: "Referência inválida (categoria não existe)" });
  }

  return res.status(500).json({ error: "Erro interno do servidor" });
}

module.exports = errorHandler;
